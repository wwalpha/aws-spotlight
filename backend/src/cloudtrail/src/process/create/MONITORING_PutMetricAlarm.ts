import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const MONITORING_PutMetricAlarm = (record: CloudTrail.Record): Tables.Resource => {
  const awsRegion = record.awsRegion;
  const accountId = record.recipientAccountId;
  const alarmName = record.requestParameters.alarmName;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:cloudwatch:${awsRegion}:${accountId}:alarm:${alarmName}`,
    ResourceName: record.requestParameters.alarmName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'CloudWatch Alarm',
  };
};
