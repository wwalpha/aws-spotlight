import { CloudTrail, Tables } from 'typings';

export const SNS_DeleteTopic = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.topicArn,
});
