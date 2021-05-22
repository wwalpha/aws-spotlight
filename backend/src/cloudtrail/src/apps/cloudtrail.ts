import { S3 } from 'aws-sdk';
import { SQSRecord } from 'aws-lambda';
import { defaultTo, isEqual, uniqWith } from 'lodash';
import { DynamodbHelper } from '@alphax/dynamodb';
import zlib from 'zlib';
import { CloudTrail, EVENT_TYPE, Tables } from 'typings';
import { deleteMessage, removeError, removeIgnore, removeReadOnly } from './utils/utilities';
import { getCreateResourceItem, getRemoveResourceItem } from './utils/events';

const s3Client = new S3();

const EVENTS: EVENT_TYPE = {};
const helper = new DynamodbHelper();

// Environments
const TABLE_EVENT_TYPE = process.env.TABLE_EVENT_TYPE as string;
const TABLE_RESOURCE = process.env.TABLE_RESOURCE as string;
const TABLE_HISTORY = process.env.TABLE_HISTORY as string;
const TABLE_UNPROCESSED = process.env.TABLE_UNPROCESSED as string;

/**
 * Initialize Event Type Definition
 *
 * @returns
 */
export const initializeEvents = async () => {
  if (Object.keys(EVENTS).length !== 0) return;

  // get all event definitions
  const results = await helper.scan<Tables.EventType>({
    TableName: TABLE_EVENT_TYPE,
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
    await deleteMessage(message);

    return;
  }

  // get all records
  let records = await getRecords(message.body);

  console.log(`All Records: ${records.length}`);

  // remove readonly records
  records = removeReadOnly(records);
  // remove error records
  records = removeError(records);
  // remove ignore records
  records = removeIgnore(records, EVENTS);

  console.log(`Left Records: ${records.length}`);

  // no records
  if (records.length === 0) {
    // delete message
    await deleteMessage(message);

    return;
  }

  console.log(`Process Records: ${records.length}`);

  const newEventType = getNewEventTypeRecords(records);
  const unprocessed = getUnprocessedRecords(records);
  const createRows = getCreateRecords(records);
  const deleteRows = getDeleteRecords(records);

  console.log(`New Event Type: ${newEventType.length}`);
  console.log(`unprocessed: ${unprocessed.length}`);
  console.log(`Create: ${createRows.length}`);
  console.log(`Delete: ${deleteRows.length}`);

  await execNewEventType(newEventType);
  await execUnprocessed(unprocessed);
  await execCreateRecords(createRows);
  await execDeleteRecords(deleteRows);

  await registHistory(createRows);
  await registHistory(deleteRows);

  // delete message
  await deleteMessage(message);
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
  const payload = JSON.parse(message) as CloudTrail.Payload;

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
  console.log('Start execute new event type...');

  const eventNames = records.map((item) => ({
    EventName: item.eventName,
    EventSource: item.eventSource,
  }));

  const eventTypes = uniqWith(eventNames, isEqual);

  // create insert records
  const eventTypeRecords = eventTypes.map((item) => ({
    EventName: item.EventName,
    EventSource: item.EventSource,
    Unprocessed: true,
    Ignore: false,
  }));

  // event type bulk insert
  await helper.bulk(TABLE_EVENT_TYPE, eventTypeRecords);

  const unprocessedRecords = records.map(
    (item) =>
      ({
        EventName: item.eventName,
        EventTime: `${item.eventTime}_${item.eventID.substr(0, 8)}`,
        Raw: JSON.stringify(item),
      } as Tables.Unprocessed)
  );

  // bulk insert
  await helper.bulk(TABLE_UNPROCESSED, unprocessedRecords);
};

/**
 * Save unprocessed records
 *
 * @param records
 */
export const execUnprocessed = async (records: CloudTrail.Record[]) => {
  console.log('Start execute unprocessed...');

  const unprocessedRecords = records.map(
    (item) =>
      ({
        EventName: item.eventName,
        EventTime: `${item.eventTime}_${item.eventID.substr(0, 8)}`,
        Raw: JSON.stringify(item),
      } as Tables.Unprocessed)
  );

  // bulk insert
  await helper.bulk(TABLE_UNPROCESSED, unprocessedRecords);
};

/**
 * record create resource events
 *
 * @param records
 */
export const execCreateRecords = async (records: CloudTrail.Record[]) => {
  console.log('Start execute create record...');

  const items = records
    .map((item) => getCreateResourceItem(item))
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  // bulk insert
  await helper.bulk(TABLE_RESOURCE, items);
};

/**
 * delete all records
 *
 * @param records
 */
export const execDeleteRecords = async (records: CloudTrail.Record[]) => {
  console.log('Start execute delete record...');

  const items = records
    .map((item) => getRemoveResourceItem(item))
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  await helper.truncate(TABLE_RESOURCE, items);
};

/**
 * Regist history
 *
 * @param records
 */
const registHistory = async (records: CloudTrail.Record[]): Promise<void> => {
  const items = records.map<Tables.History>((item) => ({
    EventId: item.eventID,
    EventName: item.eventName,
    EventSource: item.eventSource,
    AWSRegion: item.awsRegion,
    EventTime: item.eventTime,
    UserName: defaultTo(item.userIdentity.userName, item.userIdentity.sessionContext.sessionIssuer.userName),
    Origin: JSON.stringify(item),
  }));

  // bulk insert
  await helper.bulk(TABLE_HISTORY, items);
};
