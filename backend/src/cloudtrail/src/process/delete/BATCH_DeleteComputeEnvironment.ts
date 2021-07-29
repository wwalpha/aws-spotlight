import { CloudTrail, Tables } from 'typings';

export const BATCH_DeleteComputeEnvironment = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.computeEnvironment,
});
