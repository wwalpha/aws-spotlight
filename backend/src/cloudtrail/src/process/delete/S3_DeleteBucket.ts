import { CloudTrail, Tables } from 'typings';

export const S3_DeleteBucket = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: `arn:aws:s3:::${record.requestParameters.bucketName}`,
});
