import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as BACKUP from '@test/expect/backup';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('backup.amazonaws.com', () => {
  test('BACKUP_CreateBackupVault', async () => {
    const event = await sendMessage(CreateEvents.BACKUP_CreateBackupVault);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:backup:ap-northeast-1:999999999999:backup-vault:Default');
    const history = await getHistory({ EventId: '7b056e66-3c3b-4766-a6b0-ef871dc29c40' });

    fs.writeFileSync('./test/expect/backup/BACKUP_CreateBackupVault_R.json', JSON.stringify(resource));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(BACKUP.CreateBackupVault_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(BACKUP.CreateBackupVault_H);
  });

  test('BACKUP_DeleteBackupVault', async () => {
    const event = await sendMessage(DeleteEvents.BACKUP_DeleteBackupVault);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:backup:ap-northeast-1:999999999999:backup-vault:Default');
    const history = await getHistory({ EventId: 'fd27ef60-1fa2-4677-877d-64fd57507d78' });

    fs.writeFileSync('./test/expect/backup/BACKUP_DeleteBackupVault_R.json', JSON.stringify(resource));

    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(BACKUP.BACKUP_DeleteBackupVault_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(BACKUP.DeleteBackupVault_H);
  });

  test('BACKUP_CreateBackupPlan', async () => {
    const event = await sendMessage(CreateEvents.BACKUP_CreateBackupPlan);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:backup:ap-northeast-1:999999999999:backup-plan:7b651dae-e446-4f77-8f2b-0900eecad12a'
    );
    const history = await getHistory({ EventId: '24e029af-4af2-4825-8f6c-c4f46a024cc1' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(BACKUP.CreateBackupPlan_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(BACKUP.CreateBackupPlan_H);
  });

  test('BACKUP_DeleteBackupPlan', async () => {
    const event = await sendMessage(DeleteEvents.BACKUP_DeleteBackupPlan);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:backup:ap-northeast-1:999999999999:backup-plan:7b651dae-e446-4f77-8f2b-0900eecad12a'
    );
    const history = await getHistory({ EventId: 'bae99bcf-1aa6-49df-994b-2e556b66b9ec' });

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(BACKUP.DeleteBackupPlan_H);
  });
});
