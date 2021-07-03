import { CloudTrail, Tables } from 'typings';

export const SYNTHETICS_DeleteCanary = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const canaryName = record.requestParameters.name;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:synthetics:${region}:${account}:canary:${canaryName}`,
  };
};
