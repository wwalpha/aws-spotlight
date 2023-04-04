import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteInternetGateway = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const internetGatewayId = record.requestParameters.internetGatewayId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:internet-gateway/${internetGatewayId}`,
  };
};
