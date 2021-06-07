import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteSnapshot = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.snapshotId,
});
