import { CloudTrail, Tables } from 'typings';

export const ECS_DeleteCluster = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.cluster.clusterArn,
});
