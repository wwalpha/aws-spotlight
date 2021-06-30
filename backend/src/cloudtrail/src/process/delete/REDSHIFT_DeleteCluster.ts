import { CloudTrail, Tables } from 'typings';

export const REDSHIFT_DeleteCluster = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const clusterIdentifier = record.responseElements.clusterIdentifier;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:redshift:${region}:${account}:cluster:${clusterIdentifier}`,
  };
};
