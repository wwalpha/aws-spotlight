import { CloudTrail, Tables } from 'typings';

export const BACKUP_DeleteBackupVault = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const backupVaultName = record.requestParameters.backupVaultName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:backup:${region}:${account}:backup-vault:${backupVaultName}`,
  };
};
