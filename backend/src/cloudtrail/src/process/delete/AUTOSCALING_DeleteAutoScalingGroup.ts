import { CloudTrail, Tables } from 'typings';

export const AUTOSCALING_DeleteAutoScalingGroup = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const autoScalingGroupName = record.requestParameters.autoScalingGroupName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:autoscaling:${region}:${account}:autoScalingGroup:*:autoScalingGroupName/${autoScalingGroupName}`,
  };
};
