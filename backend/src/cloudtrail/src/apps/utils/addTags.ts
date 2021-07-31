import * as CreateTags from '@src/process/tags';
import { Tables } from 'typings';

const addTags = async (resources?: Tables.Resource[]): Promise<void> => {
  // validation
  if (!resources) return;

  const tasks = resources.map((item) => {
    const resourceId = item.ResourceId.split('/')[1];
    const resourceArn = item.ResourceId;
    const owner = item.UserName;

    switch (item.EventName) {
      case 'EC2_RunInstances':
        return CreateTags.EC2_Instance(resourceId, owner);

      case 'RDS_CreateDBCluster':
      case 'RDS_CreateDBInstance':
        return CreateTags.RDS_DBInstance(resourceArn, owner);
    }
  });

  // execute
  await Promise.all(tasks);
};

export default addTags;
