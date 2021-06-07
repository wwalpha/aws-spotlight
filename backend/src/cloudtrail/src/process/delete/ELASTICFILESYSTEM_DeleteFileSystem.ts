import { CloudTrail, Tables } from 'typings';

export const ELASTICFILESYSTEM_DeleteFileSystem = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.fileSystemId,
});
