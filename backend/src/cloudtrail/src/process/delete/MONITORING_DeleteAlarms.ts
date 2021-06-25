import { CloudTrail, Tables } from 'typings';

export const MONITORING_DeleteAlarms = (record: CloudTrail.Record): Tables.ResourceKey[] => {
  const awsRegion = record.awsRegion;
  const accountId = record.recipientAccountId;

  return (record.requestParameters.alarmNames as string[]).map((item) => ({
    EventSource: record.eventSource,
    ResourceId: `arn:aws:cloudwatch:${awsRegion}:${accountId}:alarm:${item}`,
  }));
};
