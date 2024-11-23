import { GetItemInput } from '@alphax/dynamodb';
import { Consts } from '@src/apps/utils';

/** データ取得 */
export const get = (key: string): GetItemInput => ({
  TableName: Consts.Environments.TABLE_NAME_SETTINGS,
  Key: {
    Id: key,
  },
  ConsistentRead: true,
});
