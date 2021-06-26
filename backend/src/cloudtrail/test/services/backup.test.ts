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

    const resource = await getResource({
      EventSource: 'backup.amazonaws.com',
      ResourceId: 'arn:aws:backup:ap-northeast-1:999999999999:backup-vault:Default',
    });
    const history = await getHistory({ EventId: '7b056e66-3c3b-4766-a6b0-ef871dc29c40' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(BACKUP.CreateBackupVault_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(BACKUP.CreateBackupVault_H);
  });
});
