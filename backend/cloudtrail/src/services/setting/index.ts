import { DynamodbHelper } from '@src/apps/utils';
import { Tables } from 'typings';
import * as Queries from './queries';

/** 詳細取得 */
export const describe = async (key: string): Promise<Tables.Settings.ReportFilter | undefined> => {
  const results = await DynamodbHelper.get<Tables.Settings.ReportFilter>(Queries.get(key));

  return results?.Item;
};

/** 内容更新 */
export const registReportFilter = async (item: Tables.Settings.ReportFilter): Promise<void> => {
  await DynamodbHelper.put(Queries.putReportFilter(item));
};
