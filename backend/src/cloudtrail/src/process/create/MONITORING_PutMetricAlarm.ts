import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const MONITORING_PutMetricAlarm = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  ResourceId: record.requestParameters.alarmName,
  ResourceName: record.requestParameters.alarmName,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'CloudWatch Alarm',
});
