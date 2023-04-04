import { CloudTrail, Tables } from 'typings';

export const IOT_DeleteTopicRule = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const ruleName = record.requestParameters.ruleName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:iot:${region}:${account}:rule/${ruleName}`,
  };
};
