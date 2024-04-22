import { SQSRecord } from 'aws-lambda';
import { TransactWriteItem } from '@aws-sdk/client-dynamodb';
import _ from 'lodash';
import { EVENT_TYPE, Tables } from 'typings';
import { Utilities, Consts, DynamodbHelper, Logger } from './utils';
import { sendMail } from './utils/utilities';
import * as ArnService from '@src/process/ArnService';
import { EventService, ResourceService } from '@src/services';
import { Environments } from './utils/consts';

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
 * Process events
 *
 * @param message
 */
export const execute = async (message: SQSRecord) => {
  // get all records
  const results = await Promise.all(
    message.body.split(',').map(async (eventId) => EventService.describe({ EventId: eventId }))
  );

  const dataRows = results.filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  // 新規イベントの処理
  await processNewRecords(dataRows);
  // 既存イベントの処理
  await processRecords(dataRows);

  // delete message
  await Utilities.deleteSQSMessage(message);

  Logger.info(`Delete Message: ${message.messageId}`);
};

/**
 * Process new records
 */
const processNewRecords = async (records: Tables.TEvents[]) => {
  const newRecords = records.filter((item) => {
    const service = item.EventSource.split('.')[0].toUpperCase();
    const definition = EVENTS[`${service}_${item.EventName}`];

    return definition === undefined;
  });

  // 一括登録イベント
  await Promise.all(newRecords.map((item) => processNewEventType(item)));
};

/**
 * Process records
 * @param events
 */
const processRecords = async (events: Tables.TEvents[]) => {
  // 処理対象のみ
  const targets = events.filter((item) => {
    const service = item.EventSource.split('.')[0].toUpperCase();
    const definition = EVENTS[`${service}_${item.EventName}`];

    if (definition?.Create === true || definition?.Delete === true) {
      return true;
    }

    return false;
  });

  const resources: Tables.TResource[] = [];
  const unprocesses: Tables.TUnprocessed[] = [];

  // 処理可能なデータを分ける
  targets.forEach(async (item) => {
    const arns = await ArnService.start(item);

    if (arns.length === 0) {
      unprocesses.push(Utilities.getUnprocessedItem(item, 'NEW'));
    } else {
      arns.forEach((arn) => resources.push(arn));
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
