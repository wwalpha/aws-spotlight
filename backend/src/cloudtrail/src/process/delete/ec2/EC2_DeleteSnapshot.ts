import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteSnapshot = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const snapshotId = record.requestParameters.snapshotId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}::snapshot/${snapshotId}`,
  };
};
