import { CloudTrail, Tables } from 'typings';

export const TIMESTREAM_DeleteDatabase = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const databaseName = record.requestParameters.databaseName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:timestream:${region}:${account}:database/${databaseName}`,
  };
};
