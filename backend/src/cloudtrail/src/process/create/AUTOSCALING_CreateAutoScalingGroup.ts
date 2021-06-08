import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const AUTOSCALING_CreateAutoScalingGroup = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  ResourceId: record.requestParameters.autoScalingGroupName,
  ResourceName: record.requestParameters.autoScalingGroupName,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'AutoScaling Group',
});
