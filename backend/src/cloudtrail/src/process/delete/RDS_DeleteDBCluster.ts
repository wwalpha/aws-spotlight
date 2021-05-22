import { CloudTrail, Tables } from 'typings';

export const RDS_DeleteDBCluster = (record: CloudTrail.Record): Tables.ResouceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.dBClusterArn,
});
