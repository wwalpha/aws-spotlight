import { CloudTrail, Tables } from 'typings';

export const GLUE_DeleteDatabase = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const databaseName = record.requestParameters.name;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:glue:${region}:${account}:/database/${databaseName}`,
  };
};
