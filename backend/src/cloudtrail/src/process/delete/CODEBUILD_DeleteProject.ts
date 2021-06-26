import { CloudTrail, Tables } from 'typings';

export const CODEBUILD_DeleteProject = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.name,
});
