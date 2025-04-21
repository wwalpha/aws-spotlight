import { Consts, DynamodbHelper } from '@src/apps/utils';
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

/** 詳細取得 */
export const getUserName = async (resourceId: string): Promise<string | undefined> => {
  const results = await describe({ ResourceId: resourceId });

  if (!results) {
    return undefined;
  }
  return results.UserName;
};

export const getListByEventSource = async (eventSource: string, eventTime?: string): Promise<Tables.TResource[]> => {
  const results = await DynamodbHelper.query<Tables.TResource>(Queries.getListByEventSource(eventSource, eventTime));

  return results.Items;
};

export const registLatest = async (item: Tables.TResource): Promise<void> => {
  try {
    await DynamodbHelper.put({
      TableName: Consts.Environments.TABLE_NAME_RESOURCES,
      Item: item,
      ConditionExpression:
        'attribute_not_exists(ResourceId) OR EventTime < :EventTime OR (EventTime = :EventTime AND :Status = :STATUS) OR (EventTime = :EventTime AND UserName <> :UserName)',
      ExpressionAttributeValues: {
        ':EventTime': item.EventTime,
        ':STATUS': 'Deleted',
        ':Status': item.Status,
        ':UserName': item.UserName,
      },
    });
  } catch (error: any) {
    if (error.name !== 'ConditionalCheckFailedException') {
      throw error;
    }
  }
};

/** リソース一覧取得 */
export const listResources = async (): Promise<Tables.TResource[]> => {
  const results = await DynamodbHelper.scan<Tables.TResource>(Queries.queryByCreated());

  return results.Items;
};
