import { DeleteItemInput, GetItemInput, PutItemInput, ScanInput } from '@alphax/dynamodb';
import { Environments } from '@src/consts';
import { Tables } from 'typings';

/** データ取得 */
export const scan = (): ScanInput => ({
  TableName: Environments.TABLE_NAME_EVENT_TYPE,
});

/** データ取得 */
export const get = (key: Tables.TEventTypeKey): GetItemInput => ({
  TableName: Environments.TABLE_NAME_EVENT_TYPE,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TEventType): PutItemInput<Tables.TEventType> => ({
  TableName: Environments.TABLE_NAME_EVENT_TYPE,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TEventTypeKey): DeleteItemInput => ({
  TableName: Environments.TABLE_NAME_EVENT_TYPE,
  Key: key,
});
