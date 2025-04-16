import { GetItemInput, PutItemInput } from '@alphax/dynamodb';
import { Consts } from '@src/apps/utils';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: string): GetItemInput => ({
  TableName: Consts.Environments.TABLE_NAME_SETTINGS,
  Key: {
    Id: key,
  },
  ConsistentRead: true,
});

// /** データ登録 */
export const putReportFilter = (item: Tables.Settings.ReportFilter): PutItemInput<Tables.Settings.ReportFilter> => ({
  TableName: Consts.Environments.TABLE_NAME_SETTINGS,
  Item: item,
});
