import { CloudTrail, Tables } from 'typings';

export const ELASTICACHE_DeleteCacheSubnetGroup = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const cacheSubnetGroupName = record.requestParameters.cacheSubnetGroupName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:elasticache:${region}:${account}:subnetgroup:${cacheSubnetGroupName}`,
  };
};
