import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const SQS_CreateQueue = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const queueUrl: string = record.responseElements.queueUrl;
  const queueName = queueUrl.split('/')[queueUrl.split('/').length - 1];

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:sqs:${region}:${account}:${queueName}`,
    ResourceName: queueName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'SQS',
  };
};
