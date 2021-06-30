import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const AUTOSCALING_CreateAutoScalingGroup = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const autoScalingGroupName = record.requestParameters.autoScalingGroupName;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:autoscaling:${region}:${account}:autoScalingGroup:*:autoScalingGroupName/${autoScalingGroupName}`,
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
