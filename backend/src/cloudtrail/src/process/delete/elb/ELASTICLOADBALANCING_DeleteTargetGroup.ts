import { CloudTrail, Tables } from 'typings';

export const ELASTICLOADBALANCING_DeleteTargetGroup = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.targetGroupArn,
});
