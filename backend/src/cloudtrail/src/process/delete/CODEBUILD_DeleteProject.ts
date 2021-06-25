import { CloudTrail, Tables } from 'typings';

export const CODEBUILD_DeleteProject = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.name,
});
