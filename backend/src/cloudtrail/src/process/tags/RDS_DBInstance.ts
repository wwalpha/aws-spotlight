import { AddTagsToResourceCommand, DescribeDBInstancesCommand, RDS } from '@aws-sdk/client-rds';
import { Tables } from 'typings';

export const RDS_DBInstance = async ({ AWSRegion, ResourceId, UserName }: Tables.TResource) => {
  const client = new RDS({ region: AWSRegion });

  // check resource exsit
  const results = await client.send(new DescribeDBInstancesCommand({ DBInstanceIdentifier: ResourceId.split('/')[1] }));

  // validation
  if (!results.DBInstances || results.DBInstances.length === 0) return;

  await client.send(new AddTagsToResourceCommand({
    ResourceName: ResourceId,
    Tags: [
      {
        Key: 'Owner',
        Value: UserName,
      },
    ],
  }));
};
