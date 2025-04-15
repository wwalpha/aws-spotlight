import _ from 'lodash';
import { Consts, DynamodbHelper } from '@src/apps/utils';
import { CloudTrailRecord, Tables } from 'typings';
import * as Queries from './queries';

/** 詳細取得 */
export const describe = async (key: Tables.TUnprocessedKey): Promise<Tables.TUnprocessed | undefined> => {
  const results = await DynamodbHelper.get<Tables.TUnprocessed>(Queries.get(key));

  return results?.Item;
};

/** 内容更新 */
export const regist = async (item: Tables.TUnprocessed): Promise<void> => {
  await DynamodbHelper.put(Queries.put(item));
};

/** 内容更新 */
export const update = async (item: Tables.TUnprocessed): Promise<void> => {
  const groupInfo = await describe({
    eventName: item.eventName,
    eventTime: item.eventTime,
  });

  // if exists
  if (!groupInfo) {
    throw new Error(`Unprocessed record is not exists. ${item.eventName},${item.eventTime}`);
  }

  await DynamodbHelper.put(Queries.put(item));
};

export const remove = async (key: Tables.TUnprocessedKey): Promise<void> => {
  await DynamodbHelper.delete(Queries.del(key));
};

export const removeAll = async (keys: Tables.TUnprocessedKey[]): Promise<void> => {
  await DynamodbHelper.truncate(Consts.Environments.TABLE_NAME_UNPROCESSED, keys);
};

/** 未処理イベント一覧 */
export const getEvents = async () => {
  const results = await DynamodbHelper.scan<Tables.TUnprocessed>(Queries.getUniqEvents());

  // 未処理のイベント一覧
  return _.uniqWith(results.Items, _.isEqual);
};

/** 全データ取得 */
export const getAll = async (): Promise<Tables.TUnprocessed[]> => {
  const results = await DynamodbHelper.scan<Tables.TUnprocessed>(Queries.scan());

  return results.Items;
};

/**
 * 一時保存
 */
export const tempSave = async (item: CloudTrailRecord): Promise<void> => {
  await regist({
    eventName: item.eventName,
    eventTime: item.eventTime,
    eventSource: item.eventSource,
    userName: item.userName,
    awsRegion: item.awsRegion,
    sourceIPAddress: item.sourceIPAddress,
    userAgent: item.userAgent,
    requestParameters: item.requestParameters,
    responseElements: item.responseElements,
    additionalEventData: item.additionalEventData,
    requestID: item.requestId,
    eventID: item.eventId,
    recipientAccountId: item.recipientAccountId,
    serviceEventDetails: item.serviceEventDetails,
    sharedEventId: item.sharedEventId,
  });
};

export const truncate = async (): Promise<void> => {
  await DynamodbHelper.truncateAll(process.env.TABLE_NAME_UNPROCESSED as string);
};
