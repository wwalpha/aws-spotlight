import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteVolume = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.volumeId,
});
