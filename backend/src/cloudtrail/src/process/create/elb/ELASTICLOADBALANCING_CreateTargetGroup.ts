import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const ELASTICLOADBALANCING_CreateTargetGroup = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  ResourceId: record.responseElements.targetGroups[0].targetGroupArn,
  ResourceName: record.responseElements.targetGroups[0].targetGroupName,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'EC2',
});
