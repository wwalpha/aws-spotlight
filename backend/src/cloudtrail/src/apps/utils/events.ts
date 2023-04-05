import * as RemoveService from '@src/process/RemoveService';
import * as CreateService from '@src/process/CreateService';

import { CloudTrail, Tables } from 'typings';
import { Consts, DynamodbHelper } from '.';

export const getCreateResourceItem = (record: CloudTrail.Record): Tables.Resource[] | undefined => {
  return CreateService.start(record);
};

export const getRemoveResourceItems = async (record: CloudTrail.Record): Promise<Tables.Resource[] | undefined> => {
  const items = RemoveService.start(record);

  if (!items) return;

  const tasks = items.map((item) =>
    DynamodbHelper.query<Tables.Resource>({
      TableName: Consts.Environments.TABLE_NAME_RESOURCES,
      KeyConditionExpression: 'ResourceId = :ResourceId',
      ExpressionAttributeValues: {
        ':ResourceId': item.ResourceId,
      },
    })
  );

  // get all rows
  const results = await Promise.all(tasks);

  // merge all records
  return results.reduce((prev, curr) => {
    if (curr.Items.length === 0) return prev;

    return [...prev, curr.Items[0]];
  }, [] as Tables.Resource[]);
};
