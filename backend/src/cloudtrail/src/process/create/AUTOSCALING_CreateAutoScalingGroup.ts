import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const AUTOSCALING_CreateAutoScalingGroup = (record: CloudTrail.Record): Tables.Resource => {
  const awsRegion = record.awsRegion;
  const accountId = record.recipientAccountId;
  const autoScalingGroupName = record.requestParameters.autoScalingGroupName;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:autoscaling:${awsRegion}:${accountId}:autoScalingGroup:*:autoScalingGroupName/${autoScalingGroupName}`,
    ResourceName: autoScalingGroupName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'AutoScaling Group',
  };
};
