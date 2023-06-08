import { DynamodbHelper } from '@src/apps/utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** 詳細取得 */
export const describe = async (key: Tables.TResourceKey): Promise<Tables.TResource | undefined> => {
  const results = await DynamodbHelper.get<Tables.TResource>(Queries.get(key));

  return results?.Item;
};

/** 内容更新 */
export const regist = async (item: Tables.TResource): Promise<void> => {
  await DynamodbHelper.put(Queries.put(item));
};

/** 内容更新 */
export const update = async (item: Tables.TResource): Promise<void> => {
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
export const remove = async (key: Tables.TResourceKey): Promise<void> => {
  await DynamodbHelper.delete(Queries.del(key));
};

/** 詳細取得 */
export const getByName = async (eventSource: string, name: string, filter?: string): Promise<Tables.TResource[]> => {
  const results = await DynamodbHelper.query<Tables.TResource>(Queries.queryByName(eventSource, name));

  if (filter) {
    return results.Items.filter((item) => item.ResourceId.indexOf(filter) !== -1);
  }

  return results.Items;
};

export const getListByEventSource = async (eventSource: string, eventTime?: string): Promise<Tables.TResource[]> => {
  const results = await DynamodbHelper.query<Tables.TResource>(Queries.getListByEventSource(eventSource, eventTime));

  return results.Items;
};
