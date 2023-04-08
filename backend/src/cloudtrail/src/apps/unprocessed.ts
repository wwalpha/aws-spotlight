import { DynamoDB } from 'aws-sdk';
import { CloudTrail, EVENT_UNPROCESSED, Tables } from 'typings';
import { Events, Consts, Utilities, DynamodbHelper } from './utils';
import { Logger } from './utils/utilities';
import _ from 'lodash';

/**
 * Delete all ignore records
 *
 * @param events
 */
export const processIgnore = async (events: Tables.TEventType[]) => {
  // filter ignore records
  const records = events.filter((item) => item.Ignore === true);

  Logger.info(`Ignore records size: ${records.length}`);

  // no records
  if (records.length === 0) return;

  for (; records.length > 0; ) {
    const item = records.shift();

    if (!item) continue;

    Logger.debug(`Ignore record process... EventName: ${item.EventName}, EventSource: ${item.EventSource}`);

    // find keys
    const queryResult = await DynamodbHelper.query<Tables.TUnprocessed>({
      TableName: Consts.Environments.TABLE_NAME_UNPROCESSED,
      ProjectionExpression: 'EventName, EventTime',
      KeyConditionExpression: '#EventName = :EventName',
      FilterExpression: '#EventSource = :EventSource',
      ExpressionAttributeNames: {
        '#EventName': 'EventName',
        '#EventSource': 'EventSource',
      },
      ExpressionAttributeValues: {
        ':EventName': item?.EventName,
        ':EventSource': item?.EventSource,
      },
    });

    // delete keys
    if (queryResult.Items.length > 0) {
      await DynamodbHelper.truncate(Consts.Environments.TABLE_NAME_UNPROCESSED, queryResult.Items);
    }
  }
};

export const processUpdate = async (events: Tables.TEventType[]) => {
  const records = await getUnprocessedRecords(events);

  console.log('events', events);

  await processRecords(records);
};

const processRecords = async (records: Tables.TUnprocessed[]) => {
  const events: EVENT_UNPROCESSED = groupByEventSource(records);

  const tasks = Object.keys(events).map(async (item) => {
    const values = events[item];

    const sorted = _.orderBy(values, ['EventTime'], ['asc']);

    // TODO
    sorted.forEach((item) => console.log(item.EventName, item.EventSource, item.EventTime));

    for (; sorted.length > 0; ) {
      const record = sorted.shift();

      // error check
      if (!record) continue;

      try {
        // parse raw data
        const item = JSON.parse(record.Raw) as CloudTrail.Record;

        await processRecord(item);
      } catch (err) {
        // dynamodb condition check
        if ((err as any).code === 'TransactionCanceledException') {
          Logger.error(err);
          return;
        }

        throw err;
      }
    }
  });

  await Promise.all(tasks);
};

const getUnprocessedRecords = async (events: Tables.TEventType[]) => {
  const { TABLE_NAME_UNPROCESSED } = Consts.Environments;

  const tasks = events.map((item) =>
    DynamodbHelper.query<Tables.TUnprocessed>({
      TableName: TABLE_NAME_UNPROCESSED,
      KeyConditionExpression: '#EventName = :EventName',
      FilterExpression: '#EventSource = :EventSource',
      ExpressionAttributeNames: {
        '#EventName': 'EventName',
        '#EventSource': 'EventSource',
      },
      ExpressionAttributeValues: {
        ':EventName': item.EventName,
        ':EventSource': item.EventSource,
      },
    })
  );

  const results = await Promise.all(tasks);
  const allRecords = results.map((item) => item.Items);

  // merge all records
  return allRecords.reduce((prev, curr) => {
    return [...prev, ...curr];
  }, [] as Tables.TUnprocessed[]);
};

const processRecord = async (record: CloudTrail.Record) => {
  const { TABLE_NAME_HISTORY, TABLE_NAME_RESOURCES, TABLE_NAME_UNPROCESSED } = Consts.Environments;

  const [createItems, updateItems, deleteItems] = await Promise.all([
    Events.getCreateResourceItem(record),
    Events.getUpdateResourceItem(record),
    Events.getRemoveResourceItems(record),
  ]);

  const transactItems: DynamoDB.DocumentClient.TransactWriteItemList = [];

  console.log(record.eventName, createItems, updateItems, deleteItems);
  // リソース新規作成
  createItems
    .map((item) => Utilities.getPutRecord(TABLE_NAME_RESOURCES, item))
    .forEach((item) => transactItems.push(item));
  // リソース更新
  updateItems
    .map((item) => Utilities.getPutRecord(TABLE_NAME_RESOURCES, item))
    .forEach((item) => transactItems.push(item));
  // リソース削除
  deleteItems
    .map((item) => Utilities.getDeleteRecord(TABLE_NAME_RESOURCES, item))
    .forEach((item) => transactItems.push(item));

  // delete unprocessed item
  transactItems.push(
    Utilities.getDeleteRecord(TABLE_NAME_UNPROCESSED, {
      EventName: record.eventName,
      EventTime: `${record.eventTime}_${record.eventID.substring(0, 8)}`,
    } as Tables.TUnprocessedKey)
  );

  // add history record
  transactItems.push(Utilities.getPutRecord(TABLE_NAME_HISTORY, Utilities.getHistoryItem(record)));

  await DynamodbHelper.transactWrite({
    TransactItems: transactItems,
  });
};

const groupByEventSource = (records: Tables.TUnprocessed[]) => {
  const events: EVENT_UNPROCESSED = {};

  const results = _.chain(records)
    .groupBy((x) => x.EventSource)
    .map((values, key) => ({ [key]: values }))
    .value();

  results.forEach((item) => {
    Object.keys(item).forEach((o) => {
      events[o] = item[o];
    });
  });

  return events;
};
