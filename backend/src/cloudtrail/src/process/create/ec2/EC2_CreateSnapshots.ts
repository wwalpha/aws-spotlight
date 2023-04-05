import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const EC2_CreateSnapshots = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const snapshotId = record.responseElements.CreateSnapshotsResponse.snapshotSet.item.snapshotId;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:ec2:${region}::snapshot/${snapshotId}`,
    ResourceName: snapshotId,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'EC2',
  };
};
