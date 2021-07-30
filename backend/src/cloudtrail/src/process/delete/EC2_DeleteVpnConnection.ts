import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteVpnConnection = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const vpnConnectionId = record.requestParameters.vpnConnectionId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:vpn-connection/${vpnConnectionId}`,
  };
};
