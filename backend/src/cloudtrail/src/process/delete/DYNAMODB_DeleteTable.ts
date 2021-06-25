import { CloudTrail, Tables } from 'typings';

export const DYNAMODB_DeleteTable = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.tableDescription.tableArn,
});
