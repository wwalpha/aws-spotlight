import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const S3_CreateBucket = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  ResourceId: `arn:aws:s3:::${record.requestParameters.bucketName}`,
  ResourceName: record.requestParameters.bucketName,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'S3',
});
