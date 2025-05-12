import { DeleteItemInput, GetItemInput, PutItemInput, QueryInput, ScanInput, UpdateInput } from '@alphax/dynamodb';
import { Consts } from '@src/apps/utils';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TExtendKey): GetItemInput => ({
  TableName: Consts.Environments.TABLE_NAME_EXTEND,
  Key: key,
  ConsistentRead: true,
});

/** データ登録 */
export const put = (item: Tables.TExtend): PutItemInput<Tables.TExtend> => ({
  TableName: Consts.Environments.TABLE_NAME_EXTEND,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TExtendKey): DeleteItemInput => ({
  TableName: Consts.Environments.TABLE_NAME_EXTEND,
  Key: {
    id: key.ResourceId,
  },
});
