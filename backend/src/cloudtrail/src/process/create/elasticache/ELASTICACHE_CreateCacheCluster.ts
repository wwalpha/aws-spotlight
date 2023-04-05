import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const ELASTICACHE_CreateCacheCluster = (record: CloudTrail.Record): Tables.Resource => {
  const cacheClusterId = record.responseElements.cacheClusterId;
  const aRN = record.responseElements.aRN;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: aRN,
    ResourceName: cacheClusterId,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'Elasticache',
  };
};
