import { CloudTrail, Tables } from 'typings';

export const S3_DeleteBucket = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.bucketName,
});
