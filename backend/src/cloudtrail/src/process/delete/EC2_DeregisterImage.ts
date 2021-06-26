import { CloudTrail, Tables } from 'typings';

export const EC2_DeregisterImage = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.imageId,
});
