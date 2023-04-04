import { CloudTrail, Tables } from 'typings';

export const CODEDEPLOY_DeleteApplication = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const applicationName = record.requestParameters.applicationName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:codedeploy:${region}:${account}:application/${applicationName}`,
  };
};
