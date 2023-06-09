import { CloudTrail, Tables } from 'typings';
import { Consts, DynamodbHelper } from './utils';
import { Logger } from './utils/utilities';
import _ from 'lodash';
import { processRecords } from './cloudtrail';

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

  for (;;) {
    const item = records.shift();

    if (!item) break;

    Logger.debug(`Ignore record process... EventName: ${item.EventName}, EventSource: ${item.EventSource}`);

    // find keys
    const queryResult = await DynamodbHelper.query<Tables.TUnprocessed>({
      TableName: Consts.Environments.TABLE_NAME_UNPROCESSED,
      KeyConditionExpression: '#EventSource = :EventSource AND #EventName = :EventName',
      ExpressionAttributeNames: {
        '#EventName': 'EventName',
        '#EventSource': 'EventSource',
      },
      ExpressionAttributeValues: {
        ':EventName': item?.EventName,
        ':EventSource': item?.EventSource,
      },
      IndexName: 'gsiIdx1',
    });

    // const registTasks = queryResult.Items.map((item) =>
    //   IgnoreService.regist(Utilities.getIgnoreItem(JSON.parse(item.Raw) as CloudTrail.Record))
    // );

    // await Promise.all(registTasks);

    // delete keys
    await DynamodbHelper.truncate(Consts.Environments.TABLE_NAME_UNPROCESSED, queryResult.Items);
  }
};

export const processUpdate = async (events: Tables.TEventType[]) => {
  const records = await getUnprocessedRecords(events);
  // const eventSources: EVENT_UNPROCESSED = groupByEventSource(records);

  const dataRows = records.map((r) => JSON.parse(r.Raw) as CloudTrail.Record);

  await processRecords(dataRows);

  await DynamodbHelper.truncate(
    Consts.Environments.TABLE_NAME_UNPROCESSED,
    records.map((r) => ({ EventName: r.EventName, EventSource: r.EventSource }))
  );

  // const tasks = Object.keys(eventSources).map(async (item) => {
  //   const values = eventSources[item];

  //   const sorted = _.orderBy(values, ['EventTime'], ['asc']);

  //   // TODO
  //   // sorted.forEach((item) => console.log(item.EventName, item.EventSource, item.EventTime));

  //   for (;;) {
  //     const record = sorted.shift();

  //     // error check
  //     if (!record) break;

  //     try {
  //       // parse raw data
  //       const item = JSON.parse(record.Raw) as CloudTrail.Record;

  //       await processRecord(item);
  //     } catch (err) {
  //       // dynamodb condition check
  //       if ((err as any).code === 'TransactionCanceledException') {
  //         Logger.error(err);
  //         return;
  //       }

  //       throw err;
  //     }
  //   }
  // });

  // await Promise.all(tasks);
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

// const processRecord = async (record: CloudTrail.Record) => {
//   // Resource ARN 情報を取得する
//   const [createItems, updateItems, deleteItems] = await Promise.all([
//     Events.getCreateResourceItems(record),
//     Events.getUpdateResourceItems(record),
//     Events.getRemoveResourceItems(record),
//   ]);

//   // 登録レコードを作成する
//   const transactItems = [...createItems, ...updateItems, ...deleteItems];

//   // checkMultipleOperations(transactItems);

//   // transactItems.forEach((item) => {
//   //   Logger.debug(JSON.stringify(item.Put));
//   //   Logger.debug(JSON.stringify(item.Delete));
//   // });

//   // 処理データなし
//   if (transactItems.length === 0) {
//     return;
//   }

//   // 一括登録
//   await DynamodbHelper.transactWrite({
//     TransactItems: transactItems,
//   });
// };

// const groupByEventSource = (records: Tables.TUnprocessed[]) => {
//   const events: EVENT_UNPROCESSED = {};

//   const results = _.chain(records)
//     .groupBy((x) => x.EventSource)
//     .map((values, key) => ({ [key]: values }))
//     .value();

//   results.forEach((item) => {
//     Object.keys(item).forEach((o) => {
//       events[o] = item[o];
//     });
//   });

//   return events;
// };
