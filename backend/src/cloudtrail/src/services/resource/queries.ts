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

// export const minusCount = (key: Tables.TGroupsKey, count: number): UpdateInput => ({
//   TableName: Environment.TABLE_NAME_GROUPS,
//   Key: key,
//   UpdateExpression: 'set #count = #count - :nums',
//   ExpressionAttributeNames: {
//     '#count': 'count',
//   },
//   ExpressionAttributeValues: {
//     ':nums': count,
//   },
// });
