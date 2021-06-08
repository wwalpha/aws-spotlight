import { CloudTrail, Tables } from 'typings';

export const IAM_DeleteAccessKey = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.accessKeyId,
});
