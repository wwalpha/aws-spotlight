import { CloudTrail, Tables } from 'typings';

export const RDS_DeleteDBClusterParameterGroup = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const clusterParameterGroupName = record.requestParameters.dBClusterParameterGroupName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:rds:${region}:${account}:cluster-pg:${clusterParameterGroupName}`,
  };
};
