import { DynamodbHelper } from '@alphax/dynamodb';
import { CloudTrail, Tables } from 'typings';
import { Environments } from './utils/consts';
import { getCreateResourceItem, getRemoveResourceItem } from './utils/events';
import { Logger, registHistory } from './utils/utilities';

const helper = new DynamodbHelper();

/**
 * Initialize Event Type Definition
 *
 * @returns
 */
export const getUnprocessedEvents = async () => {
  // get all event definitions
  const results = await helper.scan<Tables.EventType>({
    TableName: Environments.TABLE_NAME_EVENT_TYPE,
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
    const queryResult = await helper.query<Tables.Unprocessed>({
      TableName: Environments.TABLE_NAME_UNPROCESSED,
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
    await helper.truncate(Environments.TABLE_NAME_UNPROCESSED, queryResult.Items);

    await helper.update({
      TableName: Environments.TABLE_NAME_EVENT_TYPE,
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

/**
 * process create resource
 *
 * @param events
 * @returns
 */
export const processCreate = async (events: Tables.EventType[]) => {
  // filter ignore records
  const records = events.filter((item) => item.Create === true);

  Logger.info('Create records size:', records.length, records);

  // no records
  if (records.length === 0) return;

  for (; records.length > 0; ) {
    const item = records.shift();

    // find keys
    const queryResult = await helper.query<Tables.Unprocessed>({
      TableName: Environments.TABLE_NAME_UNPROCESSED,
      KeyConditionExpression: '#EventName = :EventName',
      ExpressionAttributeNames: {
        '#EventName': 'EventName',
      },
      ExpressionAttributeValues: {
        ':EventName': item?.EventName,
      },
    });

    const rawRecords = queryResult.Items.map((item) => {
      try {
        return JSON.parse(item.Raw) as CloudTrail.Record;
      } catch (err) {
        console.error(err);
        return;
      }
    }).filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

    const createItems = rawRecords
      .map((item) => item && getCreateResourceItem(item))
      .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

    // bulk insert resource
    await helper.bulk(Environments.TABLE_NAME_RESOURCE, createItems);
    // bulk insert history
    await registHistory(rawRecords);

    // remove all raw datas
    const removeItems = queryResult.Items.map(
      (item) =>
        ({
          EventName: item.EventName,
          EventTime: item.EventTime,
        } as Tables.UnprocessedKey)
    );

    await helper.truncate(Environments.TABLE_NAME_UNPROCESSED, removeItems);

    // process finished
    await helper.update({
      TableName: Environments.TABLE_NAME_EVENT_TYPE,
      Key: { EventSource: item?.EventSource, EventName: item?.EventName } as Tables.EventTypeKey,
      UpdateExpression: 'REMOVE #Unprocessed',
      ExpressionAttributeNames: {
        '#Unprocessed': 'Unprocessed',
      },
    });
  }
};

/**
 * process delete resource
 *
 * @param events
 * @returns
 */
export const processDelete = async (events: Tables.EventType[]) => {
  // filter ignore records
  const records = events.filter((item) => item.Delete === true);

  Logger.info('Delete records size:', records.length);

  // no records
  if (records.length === 0) return;

  for (; records.length > 0; ) {
    const item = records.shift();

    // find keys
    const queryResult = await helper.query<Tables.Unprocessed>({
      TableName: Environments.TABLE_NAME_UNPROCESSED,
      KeyConditionExpression: '#EventName = :EventName',
      ExpressionAttributeNames: {
        '#EventName': 'EventName',
      },
      ExpressionAttributeValues: {
        ':EventName': item?.EventName,
      },
    });

    const rawRecords = queryResult.Items.map((item) => {
      try {
        return JSON.parse(item.Raw) as CloudTrail.Record;
      } catch (err) {
        console.error(err);
        return;
      }
    }).filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

    const removeItems = rawRecords
      .map((item) => item && getRemoveResourceItem(item))
      .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

    // bulk insert resource
    await helper.truncate(Environments.TABLE_NAME_RESOURCE, removeItems);
    // bulk insert history
    await registHistory(rawRecords);

    // remove all raw datas
    const rowItems = queryResult.Items.map(
      (item) =>
        ({
          EventName: item.EventName,
          EventTime: item.EventTime,
        } as Tables.UnprocessedKey)
    );

    // truncate all rows
    await helper.truncate(Environments.TABLE_NAME_UNPROCESSED, rowItems);

    // process finished
    await helper.update({
      TableName: Environments.TABLE_NAME_EVENT_TYPE,
      Key: { EventSource: item?.EventSource, EventName: item?.EventName } as Tables.EventTypeKey,
      UpdateExpression: 'REMOVE #Unprocessed',
      ExpressionAttributeNames: {
        '#Unprocessed': 'Unprocessed',
      },
    });
  }
};
