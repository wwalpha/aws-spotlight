import { CloudTrail, Tables } from 'typings';

export const ELASTICFILESYSTEM_DeleteFileSystem = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const fileSystemId = record.requestParameters.fileSystemId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:elasticfilesystem:${region}:${account}:file-system/${fileSystemId}`,
  };
};
