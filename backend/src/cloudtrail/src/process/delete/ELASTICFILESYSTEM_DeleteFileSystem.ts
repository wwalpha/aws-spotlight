import { CloudTrail, Tables } from 'typings';

export const ELASTICFILESYSTEM_DeleteFileSystem = (record: CloudTrail.Record): Tables.ResourceKey => {
  const awsRegion = record.awsRegion;
  const accountId = record.recipientAccountId;
  const fileSystemId = record.requestParameters.fileSystemId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:elasticfilesystem:${awsRegion}:${accountId}:file-system/${fileSystemId}`,
  };
};
