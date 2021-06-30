import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const MONITORING_PutDashboard = (record: CloudTrail.Record): Tables.Resource => {
  const account = record.recipientAccountId;
  const dashboardName = record.requestParameters.dashboardName;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:cloudwatch::${account}:dashboard/${dashboardName}`,
    ResourceName: dashboardName,
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
