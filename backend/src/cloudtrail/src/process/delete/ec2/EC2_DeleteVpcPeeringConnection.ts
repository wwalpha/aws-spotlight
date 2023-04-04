import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteVpcPeeringConnection = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const vpcPeeringConnectionId = record.requestParameters.vpcPeeringConnectionId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:vpc-peering-connection/${vpcPeeringConnectionId}`,
  };
};
