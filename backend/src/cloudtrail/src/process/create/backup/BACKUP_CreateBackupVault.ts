import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const BACKUP_CreateBackupVault = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  ResourceId: record.responseElements.backupVaultArn,
  ResourceName: record.responseElements.backupVaultName,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'Backup Vault',
});
