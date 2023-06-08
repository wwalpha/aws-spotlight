import { DeleteItemInput, GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Environments } from '@src/consts';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TErrorsKey): GetItemInput => ({
  TableName: Environments.TABLE_NAME_ERRORS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TErrors): PutItemInput<Tables.TErrors> => ({
  TableName: Environments.TABLE_NAME_ERRORS,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TErrorsKey): DeleteItemInput => ({
  TableName: Environments.TABLE_NAME_ERRORS,
  Key: {
    id: key.EventName,
  },
});
