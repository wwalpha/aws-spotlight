import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const EC2_CreateTransitGateway = (record: CloudTrail.Record): Tables.Resource => {
  const tgwArn = record.responseElements.CreateTransitGatewayResponse.transitGateway.transitGatewayArn;
  // const tgwId = tgwArn.split('/')[1];

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: tgwArn,
    ResourceName: record.responseElements.publicIp,
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
