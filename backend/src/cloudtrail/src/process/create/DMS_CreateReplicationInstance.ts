import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const DMS_CreateReplicationInstance = (record: CloudTrail.Record): Tables.Resource => {
  const resourceName = record.responseElements.replicationInstance.replicationInstanceIdentifier;
  const resourceId = record.responseElements.replicationInstance.replicationInstanceArn;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: resourceId,
    ResourceName: resourceName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'Data Migration Service',
  };
};
