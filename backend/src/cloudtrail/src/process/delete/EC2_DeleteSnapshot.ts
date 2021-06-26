import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteSnapshot = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.snapshotId,
});
