import AWS from 'aws-sdk';
import { getHistory, getResource, receiveMessage, receiveMessageData, sendMessageOnly } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

const EVENT_SOURCE = 'ec2.amazonaws.com';

describe(EVENT_SOURCE, () => {
  test('Multiple records', async () => {
    await sendMessageOnly([CreateEvents.EC2_RunInstances, CreateEvents.RDS_CreateDBCluster]);

    await cloudtrail(await receiveMessageData());

    const ec2Resource = await getResource({
      EventSource: 'ec2.amazonaws.com',
      ResourceId: 'i-0fc5d99558e8357e8',
    });
    const rdsResource = await getResource({
      EventSource: 'rds.amazonaws.com',
      ResourceId: 'arn:aws:rds:ap-northeast-1:999999999999:cluster:database-4',
    });
    const ec2History = await getHistory({ EventId: 'a5848021-7469-441a-8f2e-f7aa5b61a46b' });
    const rdsHistory = await getHistory({ EventId: '9f93308d-38b1-405b-bf1b-68e0fd1a3c09' });

    const msgLength = (await receiveMessage()).Messages?.length;

    expect(msgLength).toBeUndefined();
    expect(ec2Resource).not.toBeUndefined();
    expect(rdsResource).not.toBeUndefined();

    expect(ec2History).not.toBeUndefined();
    expect(rdsHistory).not.toBeUndefined();
  });

  test('Resource not exist', async () => {
    await sendMessageOnly([CreateEvents.RDS_CreateDBCluster, DeleteEvents.DS_DeleteDirectory]);

    await cloudtrail(await receiveMessageData());

    const rdsResource = await getResource({
      EventSource: 'rds.amazonaws.com',
      ResourceId: 'arn:aws:rds:ap-northeast-1:999999999999:cluster:database-4',
    });
    const rdsHistory = await getHistory({ EventId: '9f93308d-38b1-405b-bf1b-68e0fd1a3c09' });

    expect((await receiveMessage()).Messages?.length).toBe(1);

    expect(rdsResource).not.toBeUndefined();
    expect(rdsHistory).not.toBeUndefined();
  });

  test('Same resource in one message', async () => {
    await sendMessageOnly([
      CreateEvents.RDS_CreateDBCluster,
      CreateEvents.APIGATEWAY_CreateRestApi,
      DeleteEvents.RDS_DeleteDBCluster,
    ]);

    await cloudtrail(await receiveMessageData());

    const rdsResource = await getResource({
      EventSource: 'rds.amazonaws.com',
      ResourceId: 'arn:aws:rds:ap-northeast-1:999999999999:cluster:database-4',
    });
    const rdsHistory1 = await getHistory({ EventId: '9f93308d-38b1-405b-bf1b-68e0fd1a3c09' });
    const rdsHistory2 = await getHistory({ EventId: '34f9f2ba-b63e-4e45-be5e-8e399d25f321' });

    expect(rdsResource).toBeUndefined();
    expect(rdsHistory1).not.toBeUndefined();
    expect(rdsHistory2).not.toBeUndefined();
  });
});
