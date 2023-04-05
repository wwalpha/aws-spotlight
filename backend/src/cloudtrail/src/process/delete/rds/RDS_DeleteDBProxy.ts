import { CloudTrail, Tables } from 'typings';

export const RDS_DeleteDBProxy = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.dBProxy.dBProxyArn,
});
