import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const DS_CreateMicrosoftAD = (record: CloudTrail.Record): Tables.Resource => {
  const awsRegion = record.awsRegion;
  const accountId = record.recipientAccountId;
  const directoryId = record.responseElements.directoryId;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:clouddirectory:${awsRegion}:${accountId}:directory/${directoryId}`,
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
