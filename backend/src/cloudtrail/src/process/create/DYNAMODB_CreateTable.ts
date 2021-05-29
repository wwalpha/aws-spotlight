import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const DYNAMODB_CreateTable = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  ResourceId: record.responseElements.tableDescription.tableName,
  ResourceName: record.responseElements.tableDescription.tableName,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'Table',
});
