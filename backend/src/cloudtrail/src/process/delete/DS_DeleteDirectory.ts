import { CloudTrail, Tables } from 'typings';

export const DS_DeleteDirectory = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const directoryId = record.responseElements.directoryId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:clouddirectory:${region}:${account}:directory/${directoryId}`,
  };
};
