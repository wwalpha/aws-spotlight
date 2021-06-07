import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const EC2_CreateClientVpnEndpoint = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  ResourceId: record.responseElements.CreateClientVpnEndpointResponse.clientVpnEndpointId,
  ResourceName: record.responseElements.CreateClientVpnEndpointResponse.clientVpnEndpointId,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'Client VPN',
});
