import { DynamodbHelper } from '@src/apps/utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** 詳細取得 */
export const describe = async (key: Tables.ResourceKey): Promise<Tables.Resource | undefined> => {
  const results = await DynamodbHelper.get<Tables.Resource>(Queries.get(key));

  return results?.Item;
};

/** 内容更新 */
export const regist = async (item: Tables.Resource): Promise<void> => {
  await DynamodbHelper.put(Queries.put(item));
};

/** 内容更新 */
export const update = async (item: Tables.Resource): Promise<void> => {
  const groupInfo = await describe({
    ResourceId: item.ResourceId,
  });

  // if exists
  if (!groupInfo) {
    throw new Error(`Group not exists. ${item.ResourceId}`);
  }

  await DynamodbHelper.put(Queries.put(item));
};

/** グループ削除 */
export const remove = async (key: Tables.ResourceKey): Promise<void> => {
  await DynamodbHelper.delete(Queries.del(key));
};
