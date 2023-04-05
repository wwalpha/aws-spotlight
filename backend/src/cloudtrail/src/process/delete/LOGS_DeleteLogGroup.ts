import { CloudTrail, Tables } from 'typings';

export const LOGS_DeleteLogGroup = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const logGroupName = record.requestParameters.logGroupName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:logs:${region}:${account}:log-group:${logGroupName}`,
  };
};
