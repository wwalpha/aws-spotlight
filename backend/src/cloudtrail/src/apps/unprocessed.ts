import { DynamodbHelper } from '@alphax/dynamodb';
import { CloudTrail, Tables } from 'typings';
import { getCreateResourceItem } from './utils/events';
import { Logger } from './utils/utilities';

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
export const getUnprocessedEvents = async () => {
  // get all event definitions
  const results = await helper.scan<Tables.EventType>({
    TableName: TABLE_EVENT_TYPE,
    FilterExpression: '#Unprocessed = :Unprocessed',
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

  const tasks = records.map(async (item) => {
    Logger.debug(`Ignore record process... EventName: ${item.EventName}, EventSource: ${item.EventSource}`);

    // find keys
    const queryResult = await helper.query<Tables.Unprocessed>({
      TableName: TABLE_UNPROCESSED,
      ProjectionExpression: 'EventName, EventTime',
      KeyConditionExpression: '#EventName = :EventName',
      ExpressionAttributeNames: {
        '#EventName': 'EventName',
      },
      ExpressionAttributeValues: {
        ':EventName': item.EventName,
      },
    });

    // delete keys
    await helper.truncate(TABLE_UNPROCESSED, queryResult.Items);

    await helper.update({
      TableName: TABLE_EVENT_TYPE,
      Key: {
        EventName: item.EventName,
        EventSource: item.EventSource,
      } as Tables.EventTypeKey,
      UpdateExpression: 'REMOVE #Unprocessed',
      ExpressionAttributeNames: {
        '#Unprocessed': 'Unprocessed',
      },
    });
  });

  await Promise.all(tasks);
};

/**
 * process create resource
 *
 * @param events
 * @returns
 */
export const processCreate = async (events: Tables.EventType[]) => {
  // filter ignore records
  // const records = events.filter((item) => item.Create === true && item.EventName === 'CreateDBCluster');
  const records = events.filter((item) => item.Create === true);

  Logger.info('Create records size:', records.length, records);

  // no records
  if (records.length === 0) return;

  const tasks = records.map(async (item) => {
    // find keys
    const queryResult = await helper.query<Tables.Unprocessed>({
      TableName: TABLE_UNPROCESSED,
      KeyConditionExpression: '#EventName = :EventName',
      ExpressionAttributeNames: {
        '#EventName': 'EventName',
      },
      ExpressionAttributeValues: {
        ':EventName': item.EventName,
      },
    });

    const createItems = queryResult.Items.map((item) => {
      try {
        return JSON.parse(item.Raw) as CloudTrail.Record;
      } catch (err) {
        console.error(err);
        return;
      }
    })
      .map((item) => item && getCreateResourceItem(item))
      .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

    // bulk insert resource
    await helper.bulk(TABLE_RESOURCE, createItems);

    // remove all raw datas
    const removeItems = queryResult.Items.map(
      (item) =>
        ({
          EventName: item.EventName,
          EventTime: item.EventTime,
        } as Tables.UnprocessedKey)
    );

    await helper.truncate(TABLE_UNPROCESSED, removeItems);
  });

  await Promise.all(tasks);
};

/**
 * process delete resource
 *
 * @param events
 * @returns
 */
export const processDelete = async (events: Tables.EventType[]) => {
  // filter ignore records
  const records = events.filter((item) => item.Create === true);

  Logger.info('Delete records size:', records.length);

  // no records
  if (records.length === 0) return;
};
