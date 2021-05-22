import { CloudTrail, Tables } from 'typings';

export const EC2_TerminateInstances = (record: CloudTrail.Record): Tables.ResouceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.instancesSet.items[0].instanceId,
});
