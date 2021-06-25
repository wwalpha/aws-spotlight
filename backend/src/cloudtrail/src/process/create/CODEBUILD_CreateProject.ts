import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const CODEBUILD_CreateProject = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  // arn:aws:codebuild:ap-northeast-1:999999999999:project/test
  ResourceId: record.responseElements.project.arn,
  ResourceName: record.responseElements.project.name,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'Project',
});
