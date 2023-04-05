import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const IOT_CreateTopicRule = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const ruleName = record.requestParameters.ruleName;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:iot:${region}:${account}:rule/${ruleName}`,
    ResourceName: ruleName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'IoT',
  };
};
