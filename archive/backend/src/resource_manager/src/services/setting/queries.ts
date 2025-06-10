import { GetItemInput } from '@alphax/dynamodb';
import { Environments } from '@src/consts';

/** データ取得 */
export const get = (key: string): GetItemInput => ({
  TableName: Environments.TABLE_NAME_SETTINGS,
  Key: {
    Id: key,
  },
  ConsistentRead: true,
});
