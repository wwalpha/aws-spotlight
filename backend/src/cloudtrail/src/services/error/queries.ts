import { DeleteItemInput, GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Consts } from '@src/apps/utils';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TErrorsKey): GetItemInput => ({
  TableName: Consts.Environments.TABLE_NAME_ERRORS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TErrors): PutItemInput<Tables.TErrors> => ({
  TableName: Consts.Environments.TABLE_NAME_ERRORS,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TErrorsKey): DeleteItemInput => ({
  TableName: Consts.Environments.TABLE_NAME_ERRORS,
  Key: {
    id: key.EventName,
  },
});
