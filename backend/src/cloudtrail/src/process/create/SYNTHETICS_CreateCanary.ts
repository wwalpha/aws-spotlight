import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const SYNTHETICS_CreateCanary = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const canaryName = record.responseElements.Canary.Name;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:synthetics:${region}:${account}:canary:${canaryName}`,
    ResourceName: record.responseElements.botName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'VPC',
  };
};
