import { CloudTrail, Tables } from 'typings';

export const CLOUDFORMATION_DeleteStack = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.stackName,
});
