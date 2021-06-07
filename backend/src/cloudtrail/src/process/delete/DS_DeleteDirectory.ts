import { CloudTrail, Tables } from 'typings';

export const DS_DeleteDirectory = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.directoryId,
});
