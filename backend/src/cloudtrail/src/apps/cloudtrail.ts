import { SNSMessage, SQSRecord } from 'aws-lambda';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { DynamoDB, TransactWriteItem } from '@aws-sdk/client-dynamodb';
import _, { orderBy, uniqBy } from 'lodash';
import zlib from 'zlib';
import { CloudTrail, EVENT_TYPE, Tables } from 'typings';
import { Utilities, Consts, DynamodbHelper, Logger } from './utils';
import { sendMail } from './utils/utilities';
import * as ArnService from '@src/process/ArnService';
import { ResourceService } from '@src/services';
import { Environments } from './utils/consts';

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
export const executeFiltering = async (message: SQSRecord) => {
  let records = await getRecords(message.body);
  Logger.info(`Process All Records: ${records.length}`);

  // remove readonly records
  records = Utilities.removeReadOnly(records);
  Logger.info(`Excluding ReadOnly Records: ${records.length}`);

  // remove error records
  records = Utilities.removeError(records);
  Logger.info(`Excluding Error Records: ${records.length}`);

  // remove ignore records
  // records = Utilities.removeIgnore(records, EVENTS);
  // Logger.info(`Excluding Ignore Records: ${records.length}`);

  await Utilities.deleteSQSMessage(message);

  return records;
};

/**
 * Process events
 *
 * @param message
 */
export const execute = async (events: Tables.TEvents[]) => {
  // 新規イベント
  await processNewRecords(events);

  let hasError = false;

  try {
    await processRecords(events);
  } catch (err) {
    hasError = true;
    Logger.error(err);
  }
};

const processNewRecords = async (records: Tables.TEvents[]) => {
  const newRecords = records.filter((item) => {
    const service = item.EventSource.split('.')[0].toUpperCase();
    const definition = EVENTS[`${service}_${item.EventName}`];

    return definition === undefined;
  });

  // 一括登録イベント
  const tasks = newRecords.map((item) => processNewEventType(item));

  await Promise.all(tasks);
};

export const processRecords = async (events: Tables.TEvents[]) => {
  // 処理対象のみ
  const targets = events.filter((item) => {
    const service = item.EventSource.split('.')[0].toUpperCase();
    const definition = EVENTS[`${service}_${item.EventName}`];

    if (definition?.Create === true || definition?.Delete === true) {
      return true;
    }

    return false;
  });

  const histories: Tables.THistory[] = [];
  const resources: Tables.TResource[] = [];
  const unprocesses: Tables.TUnprocessed[] = [];

  // 処理可能なデータを分ける
  targets.forEach(async (item) => {
    const arns = await ArnService.start(item);

    if (arns.length === 0) {
      unprocesses.push(Utilities.getUnprocessedItem(item, 'NEW'));
    } else {
      arns.forEach((arn) => resources.push(arn));
      histories.push(Utilities.getHistoryItem(item));

      // Logger.info(JSON.stringify(item));
      // Logger.info(JSON.stringify(arns));
    }
  });

  // 処理不能なデータを未処理テーブルに登録する
  await DynamodbHelper.bulk(Environments.TABLE_NAME_UNPROCESSED, unprocesses);

  // Logger.info(JSON.stringify(resources));

  const results = _.chain(resources)
    .groupBy((x) => x.ResourceId)
    .map((values, key) => ({ [key]: values }))
    .value();

  const arns: Record<string, Tables.TResource[]> = {};

  results.forEach((item) => {
    Object.keys(item).forEach((o) => {
      arns[o] = item[o];
    });
  });

  const registTasks = Object.keys(arns).map(async (key) => {
    // イベント時刻でソート
    const res = _.orderBy(arns[key], ['EventTime'], ['desc']);
    const lastestRes = res[0];
    // イベント時刻
    const times = res.map((item) => item.EventTime);

    // 既存のリソース情報を取得
    const item = await ResourceService.describe({
      ResourceId: key,
    });

    const registItem = item ? item : lastestRes;
    // リビジョンを更新
    registItem.Revisions = _.orderBy([...times, ...registItem.Revisions]);
    // distinct array
    registItem.Revisions = _.uniq(registItem.Revisions);

    // 最後リソースのイベント時間とリビジョンの最後の時刻が一致する場合、ステータスを更新
    if (lastestRes.EventTime === registItem.Revisions[registItem.Revisions.length - 1]) {
      registItem.ResourceName = lastestRes.ResourceName || registItem.ResourceName;
      registItem.EventId = lastestRes.EventId;
      registItem.EventName = lastestRes.EventName;
      registItem.EventTime = lastestRes.EventTime;
      registItem.IdentityType = lastestRes.IdentityType;
      registItem.UserAgent = lastestRes.UserAgent;
      registItem.UserName = lastestRes.UserName;
      registItem.Status = lastestRes.Status;
    }

    return registItem;
  });

  // リソース登録情報を取得
  const registItems = await Promise.all(registTasks);

  // リソース情報を登録
  await DynamodbHelper.bulk(Environments.TABLE_NAME_RESOURCES, registItems);
};

// 新しいイベントの登録
const processNewEventType = async (record: Tables.TEvents) => {
  Logger.debug('Start execute new event type...');

  const transactItems: TransactWriteItem[] = [];
  const { TABLE_NAME_EVENT_TYPE, TABLE_NAME_UNPROCESSED } = Consts.Environments;

  // add event type
  transactItems.push(
    Utilities.getPutRecord(TABLE_NAME_EVENT_TYPE, {
      EventName: record.EventName,
      EventSource: record.EventSource,
      Unconfirmed: true,
      Ignore: true,
    } as Tables.TEventType)
  );

  // add unprocess record
  transactItems.push(Utilities.getPutRecord(TABLE_NAME_UNPROCESSED, Utilities.getUnprocessedItem(record, 'NEW')));

  // process transaction
  await DynamodbHelper.transactWrite({
    TransactItems: transactItems as any,
  });

  if (!NOTIFIED[record.EventName]) {
    NOTIFIED[record.EventName] = {
      EventName: record.EventName,
      EventSource: record.EventSource,
    };

    await sendMail('New Event Type', `Event Source: ${record.EventSource}, Event Name: ${record.EventName}`);
  }
};

/**
 * get all s3 bucket object
 *
 * @param message
 * @returns
 */
export const getRecords = async (message: string): Promise<CloudTrail.Record[]> => {
  const snsMessage = JSON.parse(message) as SNSMessage;

  // skip validation message
  if (snsMessage.Message.startsWith('CloudTrail validation message')) {
    return [];
  }

  const payload = JSON.parse(snsMessage.Message) as CloudTrail.Payload;

  // get files
  const tasks = payload.s3ObjectKey.map((item) =>
    s3Client.send(
      new GetObjectCommand({
        Bucket: payload.s3Bucket,
        Key: item,
      })
    )
  );

  // get all files
  const files = await Promise.all(tasks);

  // unzip content
  const records = (
    await Promise.all(
      files.map(async (item) => {
        const content = await item.Body?.transformToByteArray();

        if (!content) return undefined;

        // @ts-ignore
        return JSON.parse(zlib.gunzipSync(content)) as CloudTrail.Event;
      })
    )
  ).filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  Logger.debug('Records', records);

  // merge all records
  const newArray = records.reduce((prev, curr) => {
    return [...prev, ...curr.Records];
  }, [] as CloudTrail.Record[]);

  // 時間順
  return orderBy(newArray, ['eventTime'], ['asc']);
};
