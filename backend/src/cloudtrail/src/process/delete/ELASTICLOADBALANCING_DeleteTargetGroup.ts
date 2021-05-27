import { CloudTrail, Tables } from 'typings';

export const ELASTICLOADBALANCING_DeleteTargetGroup = (record: CloudTrail.Record): Tables.ResouceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.targetGroupArn,
});
