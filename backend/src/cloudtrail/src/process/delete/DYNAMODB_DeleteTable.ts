import { CloudTrail, Tables } from 'typings';

export const DYNAMODB_DeleteTable = (record: CloudTrail.Record): Tables.ResouceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.tableName,
});
