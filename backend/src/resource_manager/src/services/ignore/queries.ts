import { DeleteItemInput, GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Environments } from '@src/consts';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TIgnoreKey): GetItemInput => ({
  TableName: Environments.TABLE_NAME_IGNORES,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TIgnore): PutItemInput<Tables.TIgnore> => ({
  TableName: Environments.TABLE_NAME_IGNORES,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TIgnoreKey): DeleteItemInput => ({
  TableName: Environments.TABLE_NAME_IGNORES,
  Key: key,
});
