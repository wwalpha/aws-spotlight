import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const RDS_CreateDBCluster = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity.userName, record.userIdentity.sessionContext.sessionIssuer.userName),
  ResourceId: record.responseElements.dBClusterArn,
  ResourceName: record.responseElements.dBClusterIdentifier,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
});
