import { RDS } from 'aws-sdk';

const client = new RDS();

export const RDS_DBInstance = async (arn: string, owner: string) =>
  client.addTagsToResource({
    ResourceName: arn,
    Tags: [
      {
        Key: 'Owner',
        Value: owner,
      },
    ],
  });
