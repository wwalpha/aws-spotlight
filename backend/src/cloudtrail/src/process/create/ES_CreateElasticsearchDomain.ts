import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const ES_CreateElasticsearchDomain = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  ResourceId: record.responseElements.domainStatus.aRN,
  ResourceName: record.responseElements.domainStatus.domainName,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'Domain',
});
