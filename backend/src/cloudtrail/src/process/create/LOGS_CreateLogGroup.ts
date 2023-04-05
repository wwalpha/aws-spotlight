import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const LOGS_CreateLogGroup = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const logGroupName = record.requestParameters.logGroupName;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:logs:${region}:${account}:log-group:${logGroupName}`,
    ResourceName: logGroupName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'CloudWatch Logs',
  };
};
