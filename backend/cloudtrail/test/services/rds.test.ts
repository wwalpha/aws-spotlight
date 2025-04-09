import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as EXPECTS from '@test/expect/rds';
import * as fs from 'fs';

describe('rds.amazonaws.com', () => {
  test('CreateDBCluster', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBCluster);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:cluster:database-4');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateDBCluster);
  });

  test('DeleteDBCluster', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteDBCluster);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:cluster:database-4');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_DeleteDBCluster);
  });

  test('RDS_RestoreDBClusterToPointInTime', async () => {
    const event = await sendMessage(CreateEvents.RDS_RestoreDBClusterToPointInTime);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:cluster:aurora-db-bk-cluster');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_RestoreDBClusterToPointInTime);
  });

  test('RDS_RestoreDBClusterFromSnapshot', async () => {
    const event = await sendMessage(CreateEvents.RDS_RestoreDBClusterFromSnapshot);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:cluster:aurora-db2-cluster');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_RestoreDBClusterFromSnapshot);
  });

  test('RDS_RestoreDBInstanceFromDBSnapshot', async () => {
    const event = await sendMessage(CreateEvents.RDS_RestoreDBInstanceFromDBSnapshot);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db:nestle-envtestdb2');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_RestoreDBInstanceFromDBSnapshot);
  });

  test('RDS_RestoreDBInstanceToPointInTime', async () => {
    const event = await sendMessage(CreateEvents.RDS_RestoreDBInstanceToPointInTime);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db:cis-rds-backup-test-recovery');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_RestoreDBInstanceToPointInTime);
  });

  test('CreateDBInstance', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBInstance);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db:onecloud-mysql');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateDBInstance);
  });

  test('DeleteDBInstance', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteDBInstance);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db:onecloud-mysql');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_DeleteDBInstance);
  });

  test('ModifyDBInstance', async () => {
    const createInstance = await sendMessage(CreateEvents.RDS_CreateDBInstanceForRename);
    await cloudtrail(createInstance);

    const event = await sendMessage(CreateEvents.RDS_ModifyDBInstance);
    await cloudtrail(event);

    const deleted = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db:onecloud-mysql-sjis');
    const created = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db:onecloud-mysql-sjis-new');

    // fs.writeFileSync('./test/expect/rds/RDS_ModifyDBInstance_Old.json', JSON.stringify(deleted));
    // fs.writeFileSync('./test/expect/rds/RDS_ModifyDBInstance_New.json', JSON.stringify(created));

    expect(deleted).not.toBeUndefined();
    expect(deleted).toEqual(EXPECTS.RDS_ModifyDBInstance_Old);
    expect(created).not.toBeUndefined();
    expect(created).toEqual(EXPECTS.RDS_ModifyDBInstance_New);
  });

  test('RDS_CreateDBProxy', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBProxy);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db-proxy:prx-057abb09c838b8840');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateDBProxy);
  });

  test('RDS_DeleteDBProxy', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteDBProxy);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:db-proxy:prx-057abb09c838b8840');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_DeleteDBProxy);
  });

  test('RDS_CreateDBClusterParameterGroup', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBClusterParameterGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:cluster-pg:test01');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateDBClusterParameterGroup);
  });

  test('RDS_DeleteDBClusterParameterGroup', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteDBClusterParameterGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:cluster-pg:test01');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_DeleteDBClusterParameterGroup);
  });

  test('RDS_CreateDBParameterGroup', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBParameterGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:pg:cdc-enable');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateDBParameterGroup);
  });

  test('RDS_DeleteDBParameterGroup', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteDBParameterGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:pg:cdc-enable');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_DeleteDBParameterGroup);
  });

  test('RDS_CreateDBSubnetGroup', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBSubnetGroup);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:subgrp:agnew-test-postgresql');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateDBSubnetGroup);
  });

  test('RDS_DeleteDBSubnetGroup', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteDBSubnetGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:subgrp:agnew-test-postgresql');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_DeleteDBSubnetGroup);
  });

  test('RDS_CreateDBClusterSnapshot', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBClusterSnapshot);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:rds:ap-northeast-1:999999999999:cluster-snapshot:aurora-db-backup-20210930'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateDBClusterSnapshot);
  });

  test('RDS_CreateOptionGroup', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateOptionGroup);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:og:sas-ora-server-parameter-group');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateOptionGroup);
  });

  test('RDS_DeleteOptionGroup', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteOptionGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:og:sas-ora-server-parameter-group');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_DeleteOptionGroup);
  });

  test('RDS_CreateDBSnapshot', async () => {
    const event = await sendMessage(CreateEvents.RDS_CreateDBSnapshot);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:snapshot:sas-ora-server');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_CreateDBSnapshot);
  });

  test('RDS_DeleteDBSnapshot', async () => {
    const event = await sendMessage(DeleteEvents.RDS_DeleteDBSnapshot);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:rds:ap-northeast-1:999999999999:snapshot:sas-ora-server');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.RDS_DeleteDBSnapshot);
  });
});
