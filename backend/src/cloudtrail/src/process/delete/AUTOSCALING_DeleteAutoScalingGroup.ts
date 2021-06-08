import { CloudTrail, Tables } from 'typings';

export const AUTOSCALING_DeleteAutoScalingGroup = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.autoScalingGroupName,
});
