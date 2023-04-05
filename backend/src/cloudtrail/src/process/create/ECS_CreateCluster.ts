import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const ECS_CreateCluster = (record: CloudTrail.Record): Tables.Resource => {
  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: record.responseElements.cluster.clusterArn,
    ResourceName: record.responseElements.cluster.clusterName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'ECS',
  };
};
