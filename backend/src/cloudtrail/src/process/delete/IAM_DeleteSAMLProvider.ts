import { CloudTrail, Tables } from 'typings';

export const IAM_DeleteSAMLProvider = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.sAMLProviderArn,
});
