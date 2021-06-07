import { CloudTrail, Tables } from 'typings';

export const S3_DeleteBucket = (record: CloudTrail.Record): Tables.ResouceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.bucketName,
});
