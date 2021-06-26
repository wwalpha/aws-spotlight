import { CloudTrail, Tables } from 'typings';

export const DS_DeleteDirectory = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const awsRegion = record.awsRegion;
  const accountId = record.recipientAccountId;
  const directoryId = record.responseElements.directoryId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:clouddirectory:${awsRegion}:${accountId}:directory/${directoryId}`,
  };
};
