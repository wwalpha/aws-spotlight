import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const TRANSFER_CreateServer = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const serverId = record.responseElements.serverId;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:transfer:${region}:${account}:server/${serverId}`,
    ResourceName: serverId,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'Transfer',
  };
};
