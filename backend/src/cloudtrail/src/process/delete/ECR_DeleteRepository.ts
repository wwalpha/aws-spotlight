import { CloudTrail, Tables } from 'typings';

export const ECR_DeleteRepository = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.repository.repositoryArn,
});
