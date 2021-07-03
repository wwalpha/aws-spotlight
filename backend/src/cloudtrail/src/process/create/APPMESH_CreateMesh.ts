import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const APPMESH_CreateMesh = (record: CloudTrail.Record): Tables.Resource => ({
  UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
  ResourceId: record.responseElements.mesh.metadata.arn,
  ResourceName: record.responseElements.mesh.meshName,
  EventName: record.eventName,
  EventSource: record.eventSource,
  EventTime: record.eventTime,
  AWSRegion: record.awsRegion,
  IdentityType: record.userIdentity.type,
  UserAgent: record.userAgent,
  EventId: record.eventID,
  Service: 'Backup Vault',
});
