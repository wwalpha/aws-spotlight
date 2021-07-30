import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteVpnGateway = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const vpnGatewayId = record.requestParameters.vpnGatewayId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:vpn-gateway/${vpnGatewayId}`,
  };
};
