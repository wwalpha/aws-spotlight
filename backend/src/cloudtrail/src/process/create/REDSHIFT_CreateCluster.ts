import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const REDSHIFT_CreateCluster = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const clusterIdentifier = record.responseElements.clusterIdentifier;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:redshift:${region}:${account}:cluster:${clusterIdentifier}`,
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
