import { CloudTrail, Tables } from 'typings';

export const EC2_DeregisterImage = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.imageId,
});
