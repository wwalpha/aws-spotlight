import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const EC2_CreateNatGateway = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const accountId = record.recipientAccountId;
  const natGatewayId = record.responseElements.CreateNatGatewayResponse.natGateway.natGatewayId;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:ec2:${region}:${accountId}:natgateway/${natGatewayId}`,
    ResourceName: record.responseElements.CreateNatGatewayResponse.natGateway.natGatewayId,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'NAT Gateway',
  };
};
