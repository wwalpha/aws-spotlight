import { CloudTrail, Tables } from 'typings';

export const AUTOSCALING_DeleteAutoScalingGroup = (record: CloudTrail.Record): Tables.ResourceKey => {
  const awsRegion = record.awsRegion;
  const accountId = record.recipientAccountId;
  const autoScalingGroupName = record.requestParameters.autoScalingGroupName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:autoscaling:${awsRegion}:${accountId}:autoScalingGroup:*:autoScalingGroupName/${autoScalingGroupName}`,
  };
};
