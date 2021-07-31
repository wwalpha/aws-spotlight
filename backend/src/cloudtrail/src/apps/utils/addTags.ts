import * as CreateTags from '@src/process/tags';
import { Tables } from 'typings';
import { Logger } from './utilities';

const addTags = async (resources?: Tables.Resource[]): Promise<void> => {
  // validation
  if (!resources) return;

  const tasks = resources
    .map((item) => {
      Logger.info('Add tags', item.ResourceId, item.UserName);

      switch (item.EventName) {
        case 'EC2_RunInstances':
          return CreateTags.EC2_Instance(item);

        case 'RDS_CreateDBCluster':
        case 'RDS_CreateDBInstance':
          return CreateTags.RDS_DBInstance(item);
      }
    })
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  // execute
  await Promise.all(tasks);
};

export default addTags;
