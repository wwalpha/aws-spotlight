import { CloudTrail, Tables } from 'typings';

export const KINESIS_DeleteStream = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const streamName = record.requestParameters.streamName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:kinesis:${region}:${account}:stream/${streamName}`,
  };
};
