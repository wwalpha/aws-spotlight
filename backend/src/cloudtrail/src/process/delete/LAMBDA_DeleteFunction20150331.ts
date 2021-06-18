import { CloudTrail, Tables } from 'typings';

export const LAMBDA_DeleteFunction20150331 = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.functionName,
});
