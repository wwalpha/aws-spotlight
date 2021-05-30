import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const EC2_RunInstances = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  ResourceId: record.responseElements.instancesSet?.items[0].instanceId,
  ResourceName: record.responseElements.instancesSet?.items[0].instanceId,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'EC2',
});
