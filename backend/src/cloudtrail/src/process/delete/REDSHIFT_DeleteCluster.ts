import { CloudTrail, Tables } from 'typings';

export const REDSHIFT_DeleteCluster = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.clusterIdentifier,
});
