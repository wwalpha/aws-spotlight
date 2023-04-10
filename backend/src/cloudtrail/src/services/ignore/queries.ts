import { DeleteItemInput, GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Consts } from '@src/apps/utils';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TIgnoreKey): GetItemInput => ({
  TableName: Consts.Environments.TABLE_NAME_IGNORES,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TIgnore): PutItemInput<Tables.TIgnore> => ({
  TableName: Consts.Environments.TABLE_NAME_IGNORES,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TIgnoreKey): DeleteItemInput => ({
  TableName: Consts.Environments.TABLE_NAME_IGNORES,
  Key: key,
});
