import { EC2 } from 'aws-sdk';
import { Tables } from 'typings';

export const EC2_Instance = async ({ AWSRegion, ResourceId, UserName }: Tables.TResource) => {
  const client = new EC2({ region: AWSRegion });
  const instanceId = ResourceId.split('/')[1];

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
          Value: UserName,
        },
      ],
    })
    .promise();
};
