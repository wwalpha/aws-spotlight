import { CreateTagsCommand, DescribeInstancesCommand, EC2Client } from '@aws-sdk/client-ec2'
import { Tables } from 'typings';

export const EC2_Instance = async ({ AWSRegion, ResourceId, UserName }: Tables.TResource) => {
  const client = new EC2Client({ region: AWSRegion });
  const instanceId = ResourceId.split('/')[1];

  // check resource exsit
  const results = await client.send(new DescribeInstancesCommand({
    InstanceIds: [instanceId],
  }));

  // validation
  if (!results.Reservations || results.Reservations.length === 0) return;

  // add tag
  await client.send(new CreateTagsCommand({
    Resources: [instanceId],
    Tags: [
      {
        Key: 'Owner',
        Value: UserName,
      },
    ],
  }))
};
