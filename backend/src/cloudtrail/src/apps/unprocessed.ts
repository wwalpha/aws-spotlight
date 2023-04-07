import { DynamoDB } from 'aws-sdk';
import { CloudTrail, Tables } from 'typings';
import { Events, Consts, Utilities, DynamodbHelper } from './utils';
import { Logger } from './utils/utilities';

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
  const createRecords = await getUnprocessedRecords(events, true);

  await processRecords(createRecords);

  const removeRecords = await getUnprocessedRecords(events, false);

  await processRecords(removeRecords);
};

const processRecords = async (records: Tables.TUnprocessed[]) => {
  const tasks = records.map(async (record) => {
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
  });

  await Promise.all(tasks);
};

const getUnprocessedRecords = async (events: Tables.TEventType[], createEvent: boolean) => {
  const { TABLE_NAME_UNPROCESSED } = Consts.Environments;

  let processEvents =
    createEvent === true
      ? events.filter((item) => item.Create === true)
      : events.filter((item) => item.Delete === true);

  const tasks = processEvents.map((item) =>
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
  console.log('processRecord start');
  const { TABLE_NAME_EVENT_TYPE, TABLE_NAME_HISTORY, TABLE_NAME_RESOURCES, TABLE_NAME_UNPROCESSED } =
    Consts.Environments;

  const [createItems, updateItems, deleteItems] = await Promise.all([
    Events.getCreateResourceItem(record),
    Events.getUpdateResourceItem(record),
    Events.getRemoveResourceItems(record),
  ]);

  const transactItems: DynamoDB.DocumentClient.TransactWriteItemList = [];

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
      EventTime: `${record.eventTime}_${record.eventID.substr(0, 8)}`,
    } as Tables.TUnprocessedKey)
  );

  // add history record
  transactItems.push(Utilities.getPutRecord(TABLE_NAME_HISTORY, Utilities.getHistoryItem(record)));

  await DynamodbHelper.transactWrite({
    TransactItems: transactItems,
  });

  console.log('processRecord end');
};
