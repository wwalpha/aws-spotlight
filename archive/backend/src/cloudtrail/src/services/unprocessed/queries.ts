import { DeleteItemInput, GetItemInput, PutItemInput, QueryInput } from '@alphax/dynamodb';
import { Consts } from '@src/apps/utils';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TUnprocessedKey): GetItemInput => ({
  TableName: Consts.Environments.TABLE_NAME_UNPROCESSED,
  Key: key,
});

/** データ登録 */
export const put = (item: Tables.TUnprocessed): PutItemInput<Tables.TUnprocessed> => ({
  TableName: Consts.Environments.TABLE_NAME_UNPROCESSED,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TUnprocessedKey): DeleteItemInput => ({
  TableName: Consts.Environments.TABLE_NAME_UNPROCESSED,
  Key: key,
});

export const getUniqEvents = (): QueryInput => ({
  TableName: Consts.Environments.TABLE_NAME_UNPROCESSED,
  ProjectionExpression: 'EventName, EventSource',
});
