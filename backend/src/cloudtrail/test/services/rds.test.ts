import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import RDS_CreateDBCluster from '../datas/create/RDS_CreateDBCluster.json';
import RDS_CreateDBInstance from '../datas/create/RDS_CreateDBInstance.json';
import RDS_DeleteDBCluster from '../datas/delete/RDS_DeleteDBCluster.json';
import RDS_DeleteDBInstance from '../datas/delete/RDS_DeleteDBInstance.json';
import { cloudtrail } from '@src/index';
import {
  RDS_CreateDBCluster_R,
  RDS_CreateDBCluster_H,
  RDS_DeleteDBCluster_H,
  RDS_CreateDBInstance_R,
  RDS_CreateDBInstance_H,
  RDS_DeleteDBInstance_H,
} from '@test/expect/rds';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('rds.amazonaws.com', () => {
  test('RDS_CreateDBCluster', async () => {
    const event = await sendMessage(RDS_CreateDBCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:cluster:database-4');
    const history = await getHistory({ EventId: '9f93308d-38b1-405b-bf1b-68e0fd1a3c09' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(RDS_CreateDBCluster_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(RDS_CreateDBCluster_H);
  });

  test('RDS_DeleteDBCluster', async () => {
    const event = await sendMessage(RDS_DeleteDBCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:cluster:database-4');
    const history = await getHistory({ EventId: '34f9f2ba-b63e-4e45-be5e-8e399d25f321' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(RDS_DeleteDBCluster_H);
  });

  test('RDS_CreateDBInstance', async () => {
    const event = await sendMessage(RDS_CreateDBInstance);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db:onecloud-mysql');
    const history = await getHistory({ EventId: '46400997-7acb-4d09-af3b-affa629dac09' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(RDS_CreateDBInstance_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(RDS_CreateDBInstance_H);
  });

  test('RDS_DeleteDBInstance', async () => {
    const event = await sendMessage(RDS_DeleteDBInstance);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db:onecloud-mysql');
    const history = await getHistory({ EventId: 'e4e10fdb-b574-41da-8d90-1251c5b84b6e' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(RDS_DeleteDBInstance_H);
  });
});
