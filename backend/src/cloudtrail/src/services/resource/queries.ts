import { DeleteItemInput, GetItemInput, PutItemInput, QueryInput, UpdateInput } from '@alphax/dynamodb';
import { Consts } from '@src/apps/utils';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TResourceKey): GetItemInput => ({
  TableName: Consts.Environments.TABLE_NAME_RESOURCES,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TResource): PutItemInput<Tables.TResource> => ({
  TableName: Consts.Environments.TABLE_NAME_RESOURCES,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TResourceKey): DeleteItemInput => ({
  TableName: Consts.Environments.TABLE_NAME_RESOURCES,
  Key: {
    id: key.ResourceId,
  },
});

export const queryByName = (eventSource: string, name: string): QueryInput => ({
  TableName: Consts.Environments.TABLE_NAME_RESOURCES,
  KeyConditionExpression: '#EventSource = :EventSource',
  FilterExpression: '#ResourceName = :ResourceName',
  ExpressionAttributeNames: {
    '#EventSource': 'EventSource',
    '#ResourceName': 'ResourceName',
  },
  ExpressionAttributeValues: {
    ':EventSource': eventSource,
    ':ResourceName': name,
  },
  IndexName: 'gsiIdx1',
});
