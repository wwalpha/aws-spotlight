import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const EC2_CreateNatGateway = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  ResourceId: record.responseElements.CreateNatGatewayResponse.natGateway.natGatewayId,
  ResourceName: record.responseElements.CreateNatGatewayResponse.natGateway.natGatewayId,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'NAT Gateway',
});
