import { CloudTrail, Tables } from 'typings';

export const ELASTICLOADBALANCING_DeleteLoadBalancer = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.loadBalancerArn,
});
