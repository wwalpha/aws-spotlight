import { CloudTrail, Tables } from 'typings';

export const ELASTICLOADBALANCING_DeleteLoadBalancer = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.loadBalancerArn,
});
