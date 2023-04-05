import { CloudTrail, Tables } from 'typings';

export const RDS_DeleteDBParameterGroup = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const dBParameterGroupName = record.requestParameters.dBParameterGroupName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:rds:${region}:${account}:pg:${dBParameterGroupName}`,
  };
};
