import { CloudTrail, Tables } from 'typings';

export const RDS_DeleteDBInstance = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.dBInstanceArn,
});
