import { ResourceService } from '../src/services';
import { DescribeInstancesCommand, EC2Client } from '@aws-sdk/client-ec2';
import { CognitoIdentityClient, DescribeIdentityCommand } from '@aws-sdk/client-cognito-identity';

const start = async () => {
  const resources = await ResourceService.listResources();

  for (;;) {
    const resource = resources.shift();

    // not found
    if (!resource) break;

    const items = resource.ResourceId.split(':');
    const service = items[2];
    const region = items[3];
    const subsystem = items[5];

    if (service === 'ec2') {
      if (subsystem.startsWith('instance')) {
        await describeEC2(region, resource.ResourceId);
      }
    }

    // if (service === 'cognito-idp') {
    //   if (subsystem === 'identitypool') {
    //     await describeCognitoIdentity(region, resource.ResourceId);
    //   }
    // }
  }
};

const describeEC2 = async (region: string, arn: string) => {
  const client = new EC2Client({ region: region });
  const instanceId = arn.split(':')[5].split('/')[1];

  const res = await client.send(new DescribeInstancesCommand({ InstanceIds: [instanceId] }));

  if (!res.Reservations) {
    console.log(arn);
  } else {
    console.log(`****${arn}****`);
  }
};

const describeCognitoIdentity = async (region: string, arn: string) => {
  const client = new CognitoIdentityClient({ region: region });

  const res = await client.send(
    new DescribeIdentityCommand({
      IdentityId: arn.split(':')[5].split('/')[1],
    })
  );

  if (!res.IdentityId) {
    console.log(arn);
  }
};

start();
