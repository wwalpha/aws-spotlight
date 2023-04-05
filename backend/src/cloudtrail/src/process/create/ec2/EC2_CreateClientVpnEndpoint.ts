import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const EC2_CreateClientVpnEndpoint = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const clientVpnEndpointId = record.responseElements.CreateClientVpnEndpointResponse.clientVpnEndpointId;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:ec2:${region}:${account}:client-vpn-endpoint/${clientVpnEndpointId}`,
    ResourceName: record.responseElements.CreateClientVpnEndpointResponse.dnsName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'EC2',
  };
};
