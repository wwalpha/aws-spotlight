import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const KINESIS_CreateStream = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const streamName = record.requestParameters.streamName;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:kinesis:${region}:${account}:stream/${streamName}`,
    ResourceName: streamName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'Stream',
  };
};
