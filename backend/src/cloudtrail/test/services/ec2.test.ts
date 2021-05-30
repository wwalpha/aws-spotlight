import AWS from 'aws-sdk';
import { getHistory, getResource, scanHistory, sendMessage } from '@test/configs/utils';
import EC2_RunInstances from '../datas/create/EC2_RunInstances.json';
import EC2_TerminateInstances from '../datas/delete/EC2_TerminateInstances.json';
import EC2_CreateImage from '../datas/create/EC2_CreateImage.json';
import EC2_DeregisterImage from '../datas/delete/EC2_DeregisterImage.json';
import * as EC2 from '@test/expect/ec2';
import { cloudtrail } from '@src/index';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('ec2.amazonaws.com', () => {
  test('EC2_RunInstances', async () => {
    const event = await sendMessage(EC2_RunInstances);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'i-0fc5d99558e8357e8' });
    const history = await getHistory({ EventId: 'a5848021-7469-441a-8f2e-f7aa5b61a46b' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.RunInstances_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.RunInstances_H);
  });

  test('EC2_TerminateInstances', async () => {
    const event = await sendMessage(EC2_TerminateInstances);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'i-0fc5d99558e8357e8' });
    const history = await getHistory({ EventId: '1c9916ba-eb47-4d50-8104-6901bc67a17d' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.TerminateInstances_H);
  });

  test('EC2_CreateImage', async () => {
    const event = await sendMessage(EC2_CreateImage);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'ami-094a52a9a2b58d074' });
    const history = await getHistory({ EventId: 'a789df4b-2551-46c1-ac94-fff16a3d0b43' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EC2.CreateImage_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.CreateImage_H);
  });

  test('EC2_DeregisterImage', async () => {
    const event = await sendMessage(EC2_DeregisterImage);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'ami-094a52a9a2b58d074' });
    const history = await getHistory({ EventId: 'e8da5c18-a3dc-4218-bc77-a721c3f6218c' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EC2.DeregisterImage_H);
  });
});
