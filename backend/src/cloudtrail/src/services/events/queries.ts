import { DeleteItemInput, GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Consts } from '@src/apps/utils';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TEventsKey): GetItemInput => ({
  TableName: Consts.Environments.TABLE_NAME_EVENTS,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TEvents): PutItemInput<Tables.TEvents> => ({
  TableName: Consts.Environments.TABLE_NAME_EVENTS,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TEventsKey): DeleteItemInput => ({
  TableName: Consts.Environments.TABLE_NAME_EVENTS,
  Key: key,
});
