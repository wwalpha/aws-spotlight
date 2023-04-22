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

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.DeleteDBCluster_H);
  });

  test('RDS_RestoreDBClusterToPointInTime', async () => {
    const event = await sendMessage(CreateEvents.RDS_RestoreDBClusterToPointInTime);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:cluster:aurora-db-bk-cluster');
    const history = await getHistory({ EventId: CreateEvents.RDS_RestoreDBClusterToPointInTime.eventID });

    // fs.writeFileSync('./test/expect/rds/RDS_RestoreDBClusterToPointInTime_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/rds/RDS_RestoreDBClusterToPointInTime_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_RestoreDBClusterToPointInTime_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_RestoreDBClusterToPointInTime_H);
  });

  test('RDS_RestoreDBClusterFromSnapshot', async () => {
    const event = await sendMessage(CreateEvents.RDS_RestoreDBClusterFromSnapshot);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:cluster:aurora-db2-cluster');
    const history = await getHistory({ EventId: CreateEvents.RDS_RestoreDBClusterFromSnapshot.eventID });

    // fs.writeFileSync('./test/expect/rds/RDS_RestoreDBClusterFromSnapshot_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/rds/RDS_RestoreDBClusterFromSnapshot_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_RestoreDBClusterFromSnapshot_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_RestoreDBClusterFromSnapshot_H);
  });

  test('RDS_RestoreDBInstanceFromDBSnapshot', async () => {
    const event = await sendMessage(CreateEvents.RDS_RestoreDBInstanceFromDBSnapshot);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db:nestle-envtestdb2');
    const history = await getHistory({ EventId: CreateEvents.RDS_RestoreDBClusterToPointInTime.eventID });

    // fs.writeFileSync('./test/expect/rds/RDS_RestoreDBInstanceFromDBSnapshot_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/rds/RDS_RestoreDBInstanceFromDBSnapshot_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_RestoreDBInstanceFromDBSnapshot_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_RestoreDBInstanceFromDBSnapshot_H);
  });

  test('RDS_RestoreDBInstanceToPointInTime', async () => {
    const event = await sendMessage(CreateEvents.RDS_RestoreDBInstanceToPointInTime);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db:cis-rds-backup-test-recovery');
    const history = await getHistory({ EventId: CreateEvents.RDS_RestoreDBInstanceToPointInTime.eventID });

    // fs.writeFileSync('./test/expect/rds/RDS_RestoreDBInstanceToPointInTime_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/rds/RDS_RestoreDBInstanceToPointInTime_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_RestoreDBInstanceToPointInTime_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_RestoreDBInstanceToPointInTime_H);
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

    expect(resource).not.toBeUndefined();

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

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_DeleteDBProxy_H);
  });

  test('RDS_CreateDBClusterParameterGroup', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBClusterParameterGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:cluster-pg:test01');
    const history = await getHistory({ EventId: CreateEvents.RDS_CreateDBClusterParameterGroup.eventID });

    // fs.writeFileSync('RDS_CreateDBClusterParameterGroup_R.json', JSON.stringify(resource));
    // fs.writeFileSync('RDS_CreateDBClusterParameterGroup_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateDBClusterParameterGroup_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_CreateDBClusterParameterGroup_H);
  });

  test('RDS_DeleteDBClusterParameterGroup', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteDBClusterParameterGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:cluster-pg:test01');
    const history = await getHistory({ EventId: DeleteEvents.RDS_DeleteDBClusterParameterGroup.eventID });

    // fs.writeFileSync('RDS_DeleteDBClusterParameterGroup_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_DeleteDBClusterParameterGroup_H);
  });

  test('RDS_CreateDBParameterGroup', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBParameterGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:pg:cdc-enable');
    const history = await getHistory({ EventId: CreateEvents.RDS_CreateDBParameterGroup.eventID });

    // fs.writeFileSync('RDS_CreateDBParameterGroup_R.json', JSON.stringify(resource));
    // fs.writeFileSync('RDS_CreateDBParameterGroup_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateDBParameterGroup_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_CreateDBParameterGroup_H);
  });

  test('RDS_DeleteDBParameterGroup', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteDBParameterGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:pg:cdc-enable');
    const history = await getHistory({ EventId: DeleteEvents.RDS_DeleteDBParameterGroup.eventID });

    // fs.writeFileSync('RDS_DeleteDBParameterGroup_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_DeleteDBParameterGroup_H);
  });

  test('RDS_CreateDBSubnetGroup', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBSubnetGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:subgrp:agnew-test-postgresql');
    const history = await getHistory({ EventId: CreateEvents.RDS_CreateDBSubnetGroup.eventID });

    // fs.writeFileSync('RDS_CreateDBSubnetGroup_R.json', JSON.stringify(resource));
    // fs.writeFileSync('RDS_CreateDBSubnetGroup_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateDBSubnetGroup_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_CreateDBSubnetGroup_H);
  });

  test('RDS_DeleteDBSubnetGroup', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteDBSubnetGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:subgrp:agnew-test-postgresql');
    const history = await getHistory({ EventId: DeleteEvents.RDS_DeleteDBSubnetGroup.eventID });

    // fs.writeFileSync('RDS_DeleteDBSubnetGroup_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_DeleteDBSubnetGroup_H);
  });

  test('RDS_CreateDBClusterSnapshot', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBClusterSnapshot);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:rds:ap-northeast-1:999999999999:cluster-snapshot:aurora-db-backup-20210930'
    );
    const history = await getHistory({ EventId: CreateEvents.RDS_CreateDBClusterSnapshot.eventID });

    fs.writeFileSync('./test/expect/rds/RDS_CreateDBClusterSnapshot_R.json', JSON.stringify(history));
    fs.writeFileSync('./test/expect/rds/RDS_CreateDBClusterSnapshot_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.RDS_CreateDBClusterSnapshot_R);

    expect(history).not.toBeUndefined();
    // expect(history).toEqual(EXPECTS.RDS_CreateDBClusterSnapshot_H);
  });

  test('RDS_CreateOptionGroup', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateOptionGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:og:sas-ora-server-parameter-group');
    const history = await getHistory({ EventId: CreateEvents.RDS_CreateOptionGroup.eventID });

    // fs.writeFileSync('./test/expect/rds/RDS_CreateOptionGroup_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/rds/RDS_CreateOptionGroup_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateOptionGroup_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_CreateOptionGroup_H);
  });

  test('RDS_DeleteOptionGroup', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteOptionGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:334678299258:og:sas-ora-server-parameter-group');
    const history = await getHistory({ EventId: DeleteEvents.RDS_DeleteDBSubnetGroup.eventID });

    // fs.writeFileSync('./test/expect/rds/RDS_DeleteOptionGroup_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_DeleteOptionGroup_H);
  });

  test('RDS_CreateDBSnapshot', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBSnapshot);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:snapshot:sas-ora-server');
    const history = await getHistory({ EventId: CreateEvents.RDS_CreateDBSnapshot.eventID });

    // fs.writeFileSync('./test/expect/rds/RDS_CreateDBSnapshot_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/rds/RDS_CreateDBSnapshot_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateDBSnapshot_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_CreateDBSnapshot_H);
  });

  test('RDS_CopyDBSnapshot', async () => {
    const event = await sendMessage(CreateEvents.RDS_CopyDBSnapshot);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:snapshot:snp-database-3-20230209');
    const history = await getHistory({ EventId: CreateEvents.RDS_CopyDBSnapshot.eventID });

    // fs.writeFileSync('./test/expect/rds/RDS_CopyDBSnapshot_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/rds/RDS_CopyDBSnapshot_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CopyDBSnapshot_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_CopyDBSnapshot_H);
  });

  test('RDS_DeleteDBSnapshot', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteDBSnapshot);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:snapshot:sas-ora-server');
    const history = await getHistory({ EventId: DeleteEvents.RDS_DeleteDBSnapshot.eventID });

    // fs.writeFileSync('./test/expect/rds/RDS_DeleteDBSnapshot_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.RDS_DeleteDBSnapshot_H);
  });
});
