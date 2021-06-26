import { DynamoDB } from 'aws-sdk';
import { orderBy } from 'lodash';
import { CloudTrail, Tables } from 'typings';
import { Events, Consts, Utilities, DynamodbHelper } from './utils';
import { Logger } from './utils/utilities';

/**
 * Initialize Event Type Definition
 *
 * @returns
 */
export const getUnprocessedEvents = async () => {
  // get all event definitions
  const results = await DynamodbHelper.scan<Tables.EventType>({
    TableName: Consts.Environments.TABLE_NAME_EVENT_TYPE,
    FilterExpression: '#Unprocessed = :Unprocessed AND attribute_not_exists(Unconfirmed)',
    ExpressionAttributeNames: {
      '#Unprocessed': 'Unprocessed',
    },
    ExpressionAttributeValues: {
      ':Unprocessed': true,
    },
  });

  return results.Items;
};

/**
 * Delete all ignore records
 *
 * @param events
 */
export const processIgnore = async (events: Tables.EventType[]) => {
  // filter ignore records
  const records = events.filter((item) => item.Ignore === true);

  Logger.info('Ignore records size:', records.length);

  // no records
  if (records.length === 0) return;

  for (; records.length > 0; ) {
    const item = records.shift();

    if (!item) continue;

    Logger.debug(`Ignore record process... EventName: ${item.EventName}, EventSource: ${item.EventSource}`);

    // find keys
    const queryResult = await DynamodbHelper.query<Tables.Unprocessed>({
      TableName: Consts.Environments.TABLE_NAME_UNPROCESSED,
      ProjectionExpression: 'EventName, EventTime',
      KeyConditionExpression: '#EventName = :EventName',
      ExpressionAttributeNames: {
        '#EventName': 'EventName',
      },
      ExpressionAttributeValues: {
        ':EventName': item?.EventName,
      },
    });

    // delete keys
    await DynamodbHelper.truncate(Consts.Environments.TABLE_NAME_UNPROCESSED, queryResult.Items);

    await DynamodbHelper.update({
      TableName: Consts.Environments.TABLE_NAME_EVENT_TYPE,
      Key: {
        EventName: item.EventName,
        EventSource: item.EventSource,
      } as Tables.EventTypeKey,
      UpdateExpression: 'REMOVE #Unprocessed',
      ExpressionAttributeNames: {
        '#Unprocessed': 'Unprocessed',
      },
    });
  }
};

export const processUpdate = async (events: Tables.EventType[]) => {
  const { TABLE_NAME_EVENT_TYPE, TABLE_NAME_HISTORY, TABLE_NAME_RESOURCE, TABLE_NAME_UNPROCESSED } = Consts.Environments;

  const createEvents = events.filter((item) => item.Create === true);
  const deleteEvents = events.filter((item) => item.Delete === true);

  const tasks = [...createEvents, ...deleteEvents].map((item) =>
    DynamodbHelper.query<Tables.Unprocessed>({
      TableName: TABLE_NAME_UNPROCESSED,
      KeyConditionExpression: '#EventName = :EventName',
      ExpressionAttributeNames: {
        '#EventName': 'EventName',
      },
      ExpressionAttributeValues: {
        ':EventName': item.EventName,
      },
    })
  );

  const results = await Promise.all(tasks);
  const allRecords = results.map((item) => item.Items);

  // merge all records
  const records = allRecords.reduce((prev, curr) => {
    return [...prev, ...curr];
  }, [] as Tables.Unprocessed[]);

  const sorted = orderBy(records, ['EventTime'], ['asc']);

  for (; sorted.length > 0; ) {
    const record = sorted.shift();

    // validation
    if (!record) continue;

    let item: CloudTrail.Record;

    try {
      // parse raw data
      item = JSON.parse(record.Raw) as CloudTrail.Record;
    } catch (err) {
      console.error(err);
      continue;
    }

    const createItem = Events.getCreateResourceItem(item);
    const deleteItems = Events.getRemoveResourceItem(item);

    const transactItems: DynamoDB.DocumentClient.TransactWriteItemList = [];

    // create records
    if (createItem) {
      // add resource record
      transactItems.push(Utilities.getPutRecord(TABLE_NAME_RESOURCE, createItem));
    }

    // delete records
    if (deleteItems) {
      deleteItems
        .map((deleteItem) => Utilities.getDeleteRecord(TABLE_NAME_RESOURCE, deleteItem))
        .forEach((deleteItem) => transactItems.push(deleteItem));
    }

    // add history record
    transactItems.push(Utilities.getPutRecord(TABLE_NAME_HISTORY, Utilities.getHistoryItem(item)));

    // delete unprocessed item
    transactItems.push(
      Utilities.getDeleteRecord(TABLE_NAME_UNPROCESSED, {
        EventName: item.eventName,
        EventTime: `${item.eventTime}_${item.eventID.substr(0, 8)}`,
      } as Tables.UnprocessedKey)
    );

    // remove unprocessed flag
    transactItems.push({
      Update: {
        TableName: TABLE_NAME_EVENT_TYPE,
        Key: {
          EventSource: item.eventSource,
          EventName: item.eventName,
        } as Tables.EventTypeKey,
        UpdateExpression: 'REMOVE #Unprocessed',
        ExpressionAttributeNames: {
          '#Unprocessed': 'Unprocessed',
        },
      },
    });

    await DynamodbHelper.getDocumentClient()
      .transactWrite({
        TransactItems: transactItems,
      })
      .promise();
  }
};
