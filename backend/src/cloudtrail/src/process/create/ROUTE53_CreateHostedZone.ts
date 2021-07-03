import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const ROUTE53_CreateHostedZone = (record: CloudTrail.Record): Tables.Resource => {
  const id = record.responseElements.hostedZone.id as string;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:route53:::${id.substring(1)}`,
    ResourceName: record.responseElements.hostedZone.name,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'HostedZone',
  };
};
