import { CloudTrail, Tables } from 'typings';

export const EC2_DeregisterImage = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const imageId = record.requestParameters.imageId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}::image/${imageId}`,
  };
};
