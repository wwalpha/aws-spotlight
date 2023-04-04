import { CloudTrail, Tables } from 'typings';

export const BACKUP_DeleteBackupPlan = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.backupPlanArn,
});
