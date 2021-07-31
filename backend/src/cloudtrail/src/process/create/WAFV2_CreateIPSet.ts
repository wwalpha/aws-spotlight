import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const WAFV2_CreateIPSet = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  ResourceId: record.responseElements.summary.aRN,
  ResourceName: record.responseElements.summary.name,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'IP Set',
});
