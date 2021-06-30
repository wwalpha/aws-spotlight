import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const DS_CreateMicrosoftAD = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const directoryId = record.responseElements.directoryId;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:clouddirectory:${region}:${account}:directory/${directoryId}`,
    ResourceName: record.requestParameters.name,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'Directory Service',
  };
};
