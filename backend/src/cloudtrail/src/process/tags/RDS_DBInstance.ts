import { RDS } from 'aws-sdk';

const client = new RDS();

export const RDS_DBInstance = async (arn: string, owner: string) => {
  // check resource exsit
  const results = await client
    .describeDBInstances({
      DBInstanceIdentifier: arn.split('/')[1],
    })
    .promise();

  // validation
  if (!results.DBInstances || results.DBInstances.length === 0) return;

  await client
    .addTagsToResource({
      ResourceName: arn,
      Tags: [
        {
          Key: 'Owner',
          Value: owner,
        },
      ],
    })
    .promise();
};
