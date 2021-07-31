import { EC2 } from 'aws-sdk';

const client = new EC2();

export const EC2_Instance = async (instanceId: string, owner: string) =>
  client.createTags({
    Resources: [instanceId],
    Tags: [
      {
        Key: 'Owner',
        Value: owner,
      },
    ],
  });
