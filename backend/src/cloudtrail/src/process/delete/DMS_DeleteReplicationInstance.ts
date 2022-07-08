import { CloudTrail, Tables } from 'typings';

export const DMS_DeleteReplicationInstance = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const resourceId = record.responseElements.replicationInstance.replicationInstanceArn;

  return {
    EventSource: record.eventSource,
    ResourceId: resourceId,
  };
};
