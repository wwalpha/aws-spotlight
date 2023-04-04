import { CloudTrail, Tables } from 'typings';

export const IAM_DeleteAccessKey = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.accessKeyId,
});
