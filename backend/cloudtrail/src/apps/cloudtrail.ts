import _ from 'lodash';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { parse } from 'csv-parse/sync';
import { EventTypeService, ResourceService, UnprocessedService } from '@src/services';
import * as ArnService from '@src/process/ArnService';
import { CloudTrailRaw, CloudTrailRecord, EVENT_TYPE, Tables } from 'typings';
import { Consts, DynamodbHelper, Logger, Utilities } from './utils';

const client = new S3Client();
const NOTIFIED: EVENT_TYPE = {};
const EVENTS: EVENT_TYPE = {};

/**
 * Get CloudTrail Records from S3
 *
 * @param bucket bucket name
 * @param key object key
 * @returns
 */
export const getRecords = async (bucket: string, key: string): Promise<CloudTrailRecord[]> => {
  // get object
  const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

  if (response.Body == null) {
    throw new Error(`File downloaded failed. Bucket: ${bucket}, Key: ${key}`);
  }

  // transform stream to string
  const content = await response.Body.transformToString();

  const records: CloudTrailRaw[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
  });

  return records.map<CloudTrailRecord>((record) => ({
    eventTime: record.eventTime,
    userName: record.userName,
    eventSource: record.eventSource,
    eventName: record.eventName,
    awsRegion: record.awsRegion,
    sourceIPAddress: record.sourceIPAddress,
    userAgent: record.userAgent,
    requestParameters: record.requestParameters !== '' ? record.requestParameters : undefined,
    responseElements: record.responseElements !== '' ? record.responseElements : undefined,
    additionalEventData: record.additionalEventData !== '' ? record.additionalEventData : undefined,
    requestId: record.requestId,
    eventId: record.eventId,
    resources: record.resources ? JSON.parse(record.resources) : undefined,
    recipientAccountId: record.recipientAccountId,
    serviceEventDetails: record.serviceEventDetails !== '' ? record.serviceEventDetails : undefined,
    sharedEventId: record.sharedEventId !== '' ? record.sharedEventId : undefined,
  }));
};

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

export const processRecords = async (records: CloudTrailRecord[]) => {
  // check new event type exists
  await checkNewEventType(records);

  // process records
  await registRecords(records);
};

/**
 * Check if new event type exists
 * If exists, add new event type to EventType table
 * and send notification
 * @param records
 */
const checkNewEventType = async (records: CloudTrailRecord[]) => {
  const newEvents = records.filter((item) => {
    const service = item.eventSource.split('.')[0].toUpperCase();
    const definition = EVENTS[`${service}_${item.eventName}`];

    return definition === undefined;
  });

  // 一括登録イベント
  await Promise.all(newEvents.map((item) => addNewEventType(item)));
};

const addNewEventType = async (record: CloudTrailRecord) => {
  Logger.debug('Start execute new event type...');

  // add new event type
  await EventTypeService.regist({
    EventName: record.eventName,
    EventSource: record.eventSource,
    Unconfirmed: true,
    Ignore: true,
  });

  // send notification
  if (!NOTIFIED[record.eventName]) {
    NOTIFIED[record.eventName] = {
      EventName: record.eventName,
      EventSource: record.eventSource,
    };

    await Utilities.sendMail('New Event Type', `Event Source: ${record.eventSource}, Event Name: ${record.eventName}`);
  }
};

const registRecords = async (records: CloudTrailRecord[]) => {
  const unconfirmed = records.filter((item) => {
    const service = item.eventSource.split('.')[0].toUpperCase();
    const definition = EVENTS[`${service}_${item.eventName}`];

    // 未確認のイベントタイプを除外
    return definition === undefined || definition.Unconfirmed === true;
  });

  // 未確認のイベントは一次保存
  await Promise.all(unconfirmed.map((item) => UnprocessedService.tempSave(item)));

  // 処理対象のみ
  const filtered = records.filter((item) => {
    const service = item.eventSource.split('.')[0].toUpperCase();
    const definition = EVENTS[`${service}_${item.eventName}`];

    return definition?.Create === true || definition?.Delete === true;
  });

  // リソースのARNを取得
  const arns = await Promise.all(filtered.map((item) => ArnService.start(item)));
  // 二次元配列を一次元に変換
  const mergedItems = arns.reduce((prev, curr) => {
    return [...prev, ...curr];
  }, [] as Tables.TResource[]);

  // 100件毎に分割し、実行する
  const chunks = _.chunk(mergedItems, 100);

  for (const chunk of chunks) {
    await Promise.all(chunk.map((items) => ResourceService.registLatest(items)));
  }
};
