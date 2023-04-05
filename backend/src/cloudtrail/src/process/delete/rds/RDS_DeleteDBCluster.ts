import { CloudTrail, Tables } from 'typings';

export const RDS_DeleteDBCluster = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.dBClusterArn,
});
