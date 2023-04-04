import { CloudTrail, Tables } from 'typings';

export const EC2_ReleaseAddress = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const allocationId = record.requestParameters.allocationId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:elastic-ip/${allocationId}`,
  };
};
