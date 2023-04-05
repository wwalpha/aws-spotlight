import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const ELASTICLOADBALANCING_CreateLoadBalancer = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  ResourceId: record.responseElements.loadBalancers[0].loadBalancerArn,
  ResourceName: record.responseElements.loadBalancers[0].loadBalancerName,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'EC2',
});
