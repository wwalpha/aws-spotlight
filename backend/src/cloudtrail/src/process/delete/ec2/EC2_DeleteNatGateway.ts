import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteNatGateway = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const natGatewayId = record.responseElements.DeleteNatGatewayResponse.natGatewayId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:natgateway/${natGatewayId}`,
  };
};
