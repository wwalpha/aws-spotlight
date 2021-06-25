import { S3 } from 'aws-sdk';
import { SNSMessage, SQSRecord } from 'aws-lambda';
import { isEqual, uniqWith } from 'lodash';
import zlib from 'zlib';
import { CloudTrail, EVENT_TYPE, Tables } from 'typings';
import { Utilities, Consts, Events, DynamodbHelper } from './utils';
import { Logger } from './utils/utilities';

const s3Client = new S3();
const EVENTS: EVENT_TYPE = {};

/**
 * Initialize Event Type Definition
 *
 * @returns
 */
export const initializeEvents = async () => {
  if (Object.keys(EVENTS).length !== 0) return;

  // get all event definitions
  const results = await DynamodbHelper.scan<Tables.EventType>({
    TableName: Consts.Environments.TABLE_NAME_EVENT_TYPE,
  });

  results.Items?.forEach((item) => {
    EVENTS[item.EventName] = item;
  });
};

/**
 * Process SQS Message
 *
 * @param message
 */
export const execute = async (message: SQSRecord) => {
  // empty body
  if (!message.body) {
    // delete message
    await Utilities.deleteMessage(message);

    return;
  }

  // get all records
  let records = await getRecords(message.body);
  // remove readonly records
  records = Utilities.removeReadOnly(records);
  // remove error records
  records = Utilities.removeError(records);
  // remove ignore records
  records = Utilities.removeIgnore(records, EVENTS);

  Logger.info(`Left Records: ${records.length}`);

  // no records
  if (records.length === 0) {
    // delete message
    await Utilities.deleteMessage(message);

    return;
  }

  Logger.info(`Process Records: ${records.length}`);

  const newEventType = getNewEventTypeRecords(records);
  const unprocessed = getUnprocessedRecords(records);
  const createRows = getCreateRecords(records);
  const deleteRows = getDeleteRecords(records);

  Logger.info(`New Event Type: ${newEventType.length}`);
  Logger.info(`Unprocessed: ${unprocessed.length}`);
  Logger.info(`Create: ${createRows.length}`);
  Logger.info(`Delete: ${deleteRows.length}`);

  await execNewEventType(newEventType);
  await execUnprocessed(unprocessed);
  await execCreateRecords(createRows);
  await execDeleteRecords(deleteRows);

  await Utilities.registHistory(createRows);
  await Utilities.registHistory(deleteRows);

  // delete message
  await Utilities.deleteMessage(message);
};

/** get create records */
const getCreateRecords = (records: CloudTrail.Record[]) =>
  records.filter((item) => {
    const definition = EVENTS[item.eventName];

    // not found settings
    if (!definition) return false;

    return definition.Create === true;
  });

/** get delete records */
const getDeleteRecords = (records: CloudTrail.Record[]) =>
  records.filter((item) => {
    const definition = EVENTS[item.eventName];

    // not found settings
    if (!definition) return false;

    return definition.Delete === true;
  });

/** get unprocessed records */
const getUnprocessedRecords = (records: CloudTrail.Record[]) =>
  records.filter((item) => {
    const definition = EVENTS[item.eventName];

    // not found settings
    if (!definition) return false;

    return definition.Unprocessed === true;
  });

/** get new event type records */
const getNewEventTypeRecords = (records: CloudTrail.Record[]) =>
  records.filter((item) => {
    const definition = EVENTS[item.eventName];

    return definition === undefined;
  });

/**
 * get all s3 bucket object
 *
 * @param message
 * @returns
 */
export const getRecords = async (message: string): Promise<CloudTrail.Record[]> => {
  const snsMessage = JSON.parse(message) as SNSMessage;

  const payload = JSON.parse(snsMessage.Message) as CloudTrail.Payload;

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
  const records = files.map((item) => {
    const content = item.Body;

    if (!content) return undefined;

    // @ts-ignore
    return JSON.parse(zlib.gunzipSync(content)) as CloudTrail.Event;
  });

  // merge all records
  return records.reduce((prev, curr) => {
    if (!curr) {
      return prev;
    }

    return [...prev, ...curr.Records];
  }, [] as CloudTrail.Record[]);
};

export const execNewEventType = async (records: CloudTrail.Record[]) => {
  Logger.debug('Start execute new event type...');

  const eventNames = records.map((item) => ({
    EventName: item.eventName,
    EventSource: item.eventSource,
  }));

  const eventTypes = uniqWith(eventNames, isEqual);

  // create insert records
  const eventTypeRecords: Tables.EventType[] = eventTypes.map((item) => ({
    EventName: item.EventName,
    EventSource: item.EventSource,
    Unprocessed: true,
    Unconfirmed: true,
    Ignore: true,
  }));

  // event type bulk insert
  await DynamodbHelper.bulk(Consts.Environments.TABLE_NAME_EVENT_TYPE, eventTypeRecords);

  const unprocessedRecords = records.map(
    (item) =>
      ({
        EventName: item.eventName,
        EventTime: `${item.eventTime}_${item.eventID.substr(0, 8)}`,
        Raw: JSON.stringify(item),
      } as Tables.Unprocessed)
  );

  // bulk insert
  await DynamodbHelper.bulk(Consts.Environments.TABLE_NAME_UNPROCESSED, unprocessedRecords);
};

/**
 * Save unprocessed records
 *
 * @param records
 */
export const execUnprocessed = async (records: CloudTrail.Record[]) => {
  Logger.debug('Start execute unprocessed...');

  const unprocessedRecords = records.map(
    (item) =>
      ({
        EventName: item.eventName,
        EventTime: `${item.eventTime}_${item.eventID.substr(0, 8)}`,
        Raw: JSON.stringify(item),
      } as Tables.Unprocessed)
  );

  // bulk insert
  await DynamodbHelper.bulk(Consts.Environments.TABLE_NAME_UNPROCESSED, unprocessedRecords);
};

/**
 * record create resource events
 *
 * @param records
 */
export const execCreateRecords = async (records: CloudTrail.Record[]) => {
  Logger.debug('Start execute create record...');

  const items = records
    .map((item) => Events.getCreateResourceItem(item))
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  // bulk insert
  await DynamodbHelper.bulk(Consts.Environments.TABLE_NAME_RESOURCE, items);
};

/**
 * delete all records
 *
 * @param records
 */
export const execDeleteRecords = async (records: CloudTrail.Record[]) => {
  Logger.debug('Start execute delete record...');

  const multiItems = records
    .map((item) => Events.getRemoveResourceItem(item))
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  const items = multiItems.reduce((prev, curr) => {
    return [...prev, ...curr];
  }, [] as Tables.ResourceKey[]);

  await DynamodbHelper.truncate(Consts.Environments.TABLE_NAME_RESOURCE, items);
};
