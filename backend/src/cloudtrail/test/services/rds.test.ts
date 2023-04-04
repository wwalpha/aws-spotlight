import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail } from '@src/index';
import * as EXPECTS from '@test/expect/rds';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('rds.amazonaws.com', () => {
  test('CreateDBCluster', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:cluster:database-4');
    const history = await getHistory({ EventId: '9f93308d-38b1-405b-bf1b-68e0fd1a3c09' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CreateDBCluster_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.CreateDBCluster_H);
  });

  test('DeleteDBCluster', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteDBCluster);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:cluster:database-4');
    const history = await getHistory({ EventId: '34f9f2ba-b63e-4e45-be5e-8e399d25f321' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.DeleteDBCluster_H);
  });

  test('CreateDBInstance', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBInstance);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db:onecloud-mysql');
    const history = await getHistory({ EventId: '46400997-7acb-4d09-af3b-affa629dac09' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CreateDBInstance_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.CreateDBInstance_H);
  });

  test('DeleteDBInstance', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteDBInstance);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db:onecloud-mysql');
    const history = await getHistory({ EventId: 'e4e10fdb-b574-41da-8d90-1251c5b84b6e' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.DeleteDBInstance_H);
  });

  test('RDS_CreateDBProxy', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBProxy);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db-proxy:prx-057abb09c838b8840');
    const history = await getHistory({ EventId: CreateEvents.RDS_CreateDBProxy.eventID });

    // fs.writeFileSync('RDS_CreateDBProxy_R.json', JSON.stringify(resource));
    // fs.writeFileSync('RDS_CreateDBProxy_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateDBProxy_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_CreateDBProxy_H);
  });

  test('RDS_DeleteDBProxy', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteDBProxy);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db-proxy:prx-057abb09c838b8840');
    const history = await getHistory({ EventId: DeleteEvents.RDS_DeleteDBProxy.eventID });

    // fs.writeFileSync('RDS_DeleteDBProxy_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_DeleteDBProxy_H);
  });
});
