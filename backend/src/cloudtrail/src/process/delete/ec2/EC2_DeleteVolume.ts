import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteVolume = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const volumeId = record.requestParameters.volumeId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:volume/${volumeId}`,
  };
};
