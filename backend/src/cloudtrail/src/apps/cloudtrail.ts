import { DynamoDB, S3 } from 'aws-sdk';
import { SNSMessage, SQSRecord } from 'aws-lambda';
import { omit, orderBy } from 'lodash';
import zlib from 'zlib';
import { CloudTrail, EVENT_TYPE, Tables } from 'typings';
import { Utilities, Consts, Events, DynamodbHelper, AddTags, Logger } from './utils';
import { sendMail } from './utils/utilities';

const s3Client = new S3();
const NOTIFIED: EVENT_TYPE = {};
const EVENTS: EVENT_TYPE = {};

/**
 * Initialize Event Type Definition
 *
 * @returns
 */
export const initializeEvents = async () => {
  if (Object.keys(EVENTS).length !== 0) return EVENTS;

  // get all event definitions
  const results = await DynamodbHelper.scan<Tables.TEventType>({
    TableName: Consts.Environments.TABLE_NAME_EVENT_TYPE,
  });

  results.Items.forEach((item) => {
    const service = item.EventSource.split('.')[0].toUpperCase();
    EVENTS[`${service}_${item.EventName}`] = item;
  });

  return EVENTS;
};

/**
 * Process SQS Message
 *
 * @param message
 */
export const execute = async (message: SQSRecord) => {
  let records = await getRecords(message.body);
  // remove readonly records
  records = Utilities.removeReadOnly(records);
  // remove error records
  records = Utilities.removeError(records);
  // remove ignore records
  records = Utilities.removeIgnore(records, EVENTS);

  // no process records
  if (records.length === 0) {
    // delete message
    await Utilities.deleteSQSMessage(message);

    return;
  }

  Logger.info(`Process Records: ${records.length}`);

  let hasError = false;

  for (;;) {
    const record = records.shift();

    // error check
    if (!record) break;

    try {
      await processRecord(record);
    } catch (err) {
      hasError = true;
      Logger.error(err);
      Logger.error(record);
    }
  }

  // no error
  if (hasError === false) {
    // delete message
    await Utilities.deleteSQSMessage(message);
  }
};

const processRecord = async (record: CloudTrail.Record) => {
  const service = record.eventSource.split('.')[0].toUpperCase();
  const definition = EVENTS[`${service}_${record.eventName}`];

  // new event
  if (!definition) {
    await processNewEventType(record);
  }

  // create event || delete event
  if (definition?.Create === true || definition?.Delete === true) {
    await processUpdate(record);
  }
};

const processNewEventType = async (record: CloudTrail.Record) => {
  Logger.debug('Start execute new event type...');

  const transactItems: DynamoDB.DocumentClient.TransactWriteItemList = [];
  const { TABLE_NAME_EVENT_TYPE, TABLE_NAME_UNPROCESSED } = Consts.Environments;

  // add event type
  transactItems.push(
    Utilities.getPutRecord(TABLE_NAME_EVENT_TYPE, {
      EventName: record.eventName,
      EventSource: record.eventSource,
      Unconfirmed: true,
      Ignore: true,
    } as Tables.TEventType)
  );

  // add unprocess record
  transactItems.push(
    Utilities.getPutRecord(TABLE_NAME_UNPROCESSED, {
      EventName: record.eventName,
      EventTime: `${record.eventTime}_${record.eventID.substring(0, 8)}`,
      Raw: JSON.stringify(record),
      EventSource: record.eventSource,
    } as Tables.TUnprocessed)
  );

  // process transaction
  await DynamodbHelper.transactWrite({
    TransactItems: transactItems,
  });

  if (!NOTIFIED[record.eventName]) {
    NOTIFIED[record.eventName] = {
      EventName: record.eventName,
      EventSource: record.eventSource,
    };

    await sendMail('New Event Type', `Event Source: ${record.eventSource}, Event Name: ${record.eventName}`);
  }
};

const processUpdate = async (record: CloudTrail.Record) => {
  // Resource ARN 情報を取得する
  const [createItems, updateItems, deleteItems] = await Promise.all([
    Events.getCreateResourceItems(record),
    Events.getUpdateResourceItems(record),
    Events.getRemoveResourceItems(record),
  ]);

  // 登録レコードを作成する
  const transactItems = [...createItems, ...updateItems, ...deleteItems];

  transactItems.forEach((item) => {
    Logger.debug(omit(item.Put, 'Item.Origin'));
    Logger.debug(omit(item.Update, 'Item.Origin'));
    Logger.debug(item.Delete);
  });

  await DynamodbHelper.transactWrite({
    TransactItems: transactItems,
  });

  // add tags to resource
  // await AddTags(createItems);
};

/**
 * get all s3 bucket object
 *
 * @param message
 * @returns
 */
export const getRecords = async (message: string): Promise<CloudTrail.Record[]> => {
  const snsMessage = JSON.parse(message) as SNSMessage;

  const payload = JSON.parse(snsMessage.Message) as CloudTrail.Payload;

  Logger.debug('S3 object keys', payload.s3ObjectKey);

  // get files
  const tasks = payload.s3ObjectKey.map((item) =>
    s3Client
      .getObject({
        Bucket: payload.s3Bucket,
        Key: item,
      })
      .promise()
  );

  // get all files
  const files = await Promise.all(tasks);

  // unzip content
  const records = files
    .map((item) => {
      const content = item.Body;

      if (!content) return undefined;

      // @ts-ignore
      return JSON.parse(zlib.gunzipSync(content)) as CloudTrail.Event;
    })
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  Logger.debug('Records', records);

  // merge all records
  const newArray = records.reduce((prev, curr) => {
    return [...prev, ...curr.Records];
  }, [] as CloudTrail.Record[]);

  // 時間順
  return orderBy(newArray, ['eventTime'], ['asc']);
};
