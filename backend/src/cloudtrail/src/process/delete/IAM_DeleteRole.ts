import { CloudTrail, Tables } from 'typings';

export const IAM_DeleteRole = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.roleName,
});
