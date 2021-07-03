import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const CLOUDFRONT_CreateDistribution = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  ResourceId: record.responseElements.distribution.aRN,
  ResourceName: record.responseElements.distribution.domainName,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'Distribution',
});
