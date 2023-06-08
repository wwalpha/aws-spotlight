import { DynamodbHelper } from '@src/utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** 詳細取得 */
export const describe = async (key: Tables.TErrorsKey): Promise<Tables.TErrors | undefined> => {
  const results = await DynamodbHelper.get<Tables.TErrors>(Queries.get(key));

  return results?.Item;
};

/** 内容更新 */
export const regist = async (item: Tables.TErrors): Promise<void> => {
  await DynamodbHelper.put(Queries.put(item));
};

/** 内容更新 */
export const update = async (item: Tables.TErrors): Promise<void> => {
  const record = await describe({
    EventName: item.EventName,
    EventTime: item.EventTime,
  });

  // if exists
  if (!record) {
    throw new Error(`Record not exists. ${item.EventName} ${item.EventTime}`);
  }

  await DynamodbHelper.put(Queries.put(item));
};

/** グループ削除 */
export const remove = async (key: Tables.TErrorsKey): Promise<void> => {
  await DynamodbHelper.delete(Queries.del(key));
};
