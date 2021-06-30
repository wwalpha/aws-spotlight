import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteVpc = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const vpcId = record.requestParameters.vpcId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:vpc/${vpcId}`,
  };
};
