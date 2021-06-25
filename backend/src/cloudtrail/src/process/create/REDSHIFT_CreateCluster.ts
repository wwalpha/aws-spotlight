import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const REDSHIFT_CreateCluster = (record: CloudTrail.Record): Tables.Resource => {
  const awsRegion = record.awsRegion;
  const accountId = record.recipientAccountId;
  const clusterIdentifier = record.responseElements.clusterIdentifier;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:redshift:${awsRegion}:${accountId}:cluster:${clusterIdentifier}`,
    ResourceName: record.responseElements.clusterIdentifier,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'Cluster',
  };
};
