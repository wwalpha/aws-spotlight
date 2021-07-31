import { RDS } from 'aws-sdk';
import { Tables } from 'typings';

export const RDS_DBInstance = async ({ AWSRegion, ResourceId, UserName }: Tables.Resource) => {
  const client = new RDS({ region: AWSRegion });

  // check resource exsit
  const results = await client
    .describeDBInstances({
      DBInstanceIdentifier: ResourceId.split('/')[1],
    })
    .promise();

  // validation
  if (!results.DBInstances || results.DBInstances.length === 0) return;

  await client
    .addTagsToResource({
      ResourceName: ResourceId,
      Tags: [
        {
          Key: 'Owner',
          Value: UserName,
        },
      ],
    })
    .promise();
};
