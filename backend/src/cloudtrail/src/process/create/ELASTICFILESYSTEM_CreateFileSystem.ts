import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const ELASTICFILESYSTEM_CreateFileSystem = (record: CloudTrail.Record): Tables.Resource => {
  const awsRegion = record.awsRegion;
  const accountId = record.recipientAccountId;
  const fileSystemId = record.responseElements.fileSystemId;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:elasticfilesystem:${awsRegion}:${accountId}:file-system/${fileSystemId}`,
    ResourceName: record.responseElements.name,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'EFS',
  };
};
