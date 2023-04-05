import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const LEX_CreateBot = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const botName = record.responseElements.botName;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:lex:${region}:${account}:bot:${botName}`,
    ResourceName: record.responseElements.botName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'Lex',
  };
};
