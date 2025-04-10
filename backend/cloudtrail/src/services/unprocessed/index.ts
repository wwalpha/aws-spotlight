import _ from 'lodash';
import { DynamodbHelper } from '@src/apps/utils';
import { Tables } from 'typings';
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
    EventName: item.EventName,
    EventTime: item.EventTime,
  });

  // if exists
  if (!groupInfo) {
    throw new Error(`Unprocessed record is not exists. ${item.EventName},${item.EventTime}`);
  }

  await DynamodbHelper.put(Queries.put(item));
};

/** グループ削除 */
export const remove = async (key: Tables.TUnprocessedKey): Promise<void> => {
  await DynamodbHelper.delete(Queries.del(key));
};

/** 未処理イベント一覧 */
export const getEvents = async () => {
  const results = await DynamodbHelper.scan<Tables.TUnprocessed>(Queries.getUniqEvents());

  // 未処理のイベント一覧
  return _.uniqWith(results.Items, _.isEqual);
};
