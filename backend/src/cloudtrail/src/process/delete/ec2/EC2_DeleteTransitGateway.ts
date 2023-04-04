import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteTransitGateway = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const tgwId = record.requestParameters.DeleteTransitGatewayRequest.TransitGatewayId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:transit-gateway/${tgwId}`,
  };
};
