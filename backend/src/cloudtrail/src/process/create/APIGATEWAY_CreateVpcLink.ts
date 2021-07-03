import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const APIGATEWAY_CreateVpcLink = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const vpcLinkId = record.responseElements.vpcLinkId;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:apigateway:${region}::/vpclinks/${vpcLinkId}`,
    ResourceName: record.responseElements.name,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'VPC Link',
  };
};
