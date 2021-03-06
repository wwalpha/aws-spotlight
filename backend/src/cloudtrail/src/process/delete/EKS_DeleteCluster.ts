import { CloudTrail, Tables } from 'typings';

export const EKS_DeleteCluster = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.cluster.arn,
});
