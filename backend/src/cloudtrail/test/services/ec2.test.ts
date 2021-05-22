import AWS from 'aws-sdk';
import { getHistory, getResource, scanHistory, sendMessage } from '@test/configs/utils';
import EC2_RunInstances from '../datas/create/EC2_RunInstances.json';
import EC2_TerminateInstances from '../datas/delete/EC2_TerminateInstances.json';
import { RunInstances_R, RunInstances_H, TerminateInstances_H } from '../expect/ec2';
import { cloudtrail } from '@src/index';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('ec2.amazonaws.com', () => {
  test('RunInstances', async () => {
    const event = await sendMessage(EC2_RunInstances);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'i-0fc5d99558e8357e8' });
    const history = await getHistory({ EventId: 'a5848021-7469-441a-8f2e-f7aa5b61a46b' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(RunInstances_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(RunInstances_H);
  });

  test('EC2_TerminateInstances', async () => {
    const event = await sendMessage(EC2_TerminateInstances);

    await cloudtrail(event);

    const resource = await getResource({ EventSource: 'ec2.amazonaws.com', ResourceId: 'i-0fc5d99558e8357e8' });
    const history = await getHistory({ EventId: '1c9916ba-eb47-4d50-8104-6901bc67a17d' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(TerminateInstances_H);
  });
});
