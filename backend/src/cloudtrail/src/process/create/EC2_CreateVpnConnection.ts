import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const EC2_CreateVpnConnection = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const vpnConnectionId = record.responseElements.vpnConnection.vpnConnectionId;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:ec2:${region}:${account}:vpn-connection/${vpnConnectionId}`,
    ResourceName: vpnConnectionId,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'Site to Site VPN',
  };
};
