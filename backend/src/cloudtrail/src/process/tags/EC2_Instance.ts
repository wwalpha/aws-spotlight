import { EC2 } from 'aws-sdk';

const client = new EC2();

export const EC2_Instance = async (instanceId: string, owner: string) => {
  // check resource exsit
  const results = await client
    .describeInstances({
      InstanceIds: [instanceId],
    })
    .promise();

  // validation
  if (!results.Reservations || results.Reservations.length === 0) return;

  // add tag
  await client
    .createTags({
      Resources: [instanceId],
      Tags: [
        {
          Key: 'Owner',
          Value: owner,
        },
      ],
    })
    .promise();
};
