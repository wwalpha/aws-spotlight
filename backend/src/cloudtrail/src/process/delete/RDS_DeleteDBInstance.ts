import { CloudTrail, Tables } from 'typings';

export const RDS_DeleteDBInstance = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.dBInstanceArn,
});
