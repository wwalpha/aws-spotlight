import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteSubnet = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const subnetId = record.requestParameters.subnetId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:subnet/${subnetId}`,
  };
};
