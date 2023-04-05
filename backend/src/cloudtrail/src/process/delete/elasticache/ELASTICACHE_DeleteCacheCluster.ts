import { CloudTrail, Tables } from 'typings';

export const ELASTICACHE_DeleteCacheCluster = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.aRN,
});
