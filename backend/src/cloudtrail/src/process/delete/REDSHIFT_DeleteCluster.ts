import { CloudTrail, Tables } from 'typings';

export const REDSHIFT_DeleteCluster = (record: CloudTrail.Record): Tables.ResourceKey => {
  const awsRegion = record.awsRegion;
  const accountId = record.recipientAccountId;
  const clusterIdentifier = record.responseElements.clusterIdentifier;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:redshift:${awsRegion}:${accountId}:cluster:${clusterIdentifier}`,
  };
};
