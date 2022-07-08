import { CloudTrail, Tables } from 'typings';

export const CONNECT_DeleteInstance = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  return {
    EventSource: record.eventSource,
    ResourceId: decodeURIComponent(record.requestParameters.InstanceId),
  };
};
