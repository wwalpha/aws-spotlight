import { CloudTrail, Tables } from 'typings';

export const RDS_DeleteDBSnapshot = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const dBParameterGroupName = record.requestParameters.dBClusterParameterGroupName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:rds:${region}:${account}:snapshot:${dBParameterGroupName}`,
  };
};
