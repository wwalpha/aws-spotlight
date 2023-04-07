import { DynamodbHelper } from '@src/apps/utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** 全件取得 */
export const getAll = async (): Promise<Tables.TEventType[]> => {
  const results = await DynamodbHelper.scan<Tables.TEventType>(Queries.scan());

  return results.Items;
};

/** 詳細取得 */
export const describe = async (key: Tables.TEventTypeKey): Promise<Tables.TEventType | undefined> => {
  const results = await DynamodbHelper.get<Tables.Resource>(Queries.get(key));

  return results?.Item;
};

/** 内容更新 */
export const regist = async (item: Tables.TEventType): Promise<void> => {
  await DynamodbHelper.put(Queries.put(item));
};

/** 内容更新 */
export const update = async (item: Tables.TEventType): Promise<void> => {
  const groupInfo = await describe({
    EventName: item.EventName,
    EventSource: item.EventSource,
  });

  // if exists
  if (!groupInfo) {
    throw new Error(`Event type not exists. ${item.EventName} ${item.EventSource}`);
  }

  await DynamodbHelper.put(Queries.put(item));
};

/** グループ削除 */
export const remove = async (key: Tables.TEventTypeKey): Promise<void> => {
  await DynamodbHelper.delete(Queries.del(key));
};
