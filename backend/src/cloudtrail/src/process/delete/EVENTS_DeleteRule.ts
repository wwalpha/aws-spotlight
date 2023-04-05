import { CloudTrail, Tables } from 'typings';

export const EVENTS_DeleteRule = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const ruleName = record.requestParameters.name;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:events:${region}:${account}:rule/${ruleName}`,
  };
};
