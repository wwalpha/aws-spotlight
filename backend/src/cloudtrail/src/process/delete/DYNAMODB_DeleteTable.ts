import { CloudTrail, Tables } from 'typings';

export const DYNAMODB_DeleteTable = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.tableDescription.tableArn,
});
