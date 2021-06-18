import { CloudTrail, Tables } from 'typings';

export const MONITORING_DeleteAlarms = (record: CloudTrail.Record): Tables.ResourceKey[] =>
  (record.requestParameters.alarmNames as string[]).map((item) => ({
    EventSource: record.eventSource,
    ResourceId: item,
  }));
