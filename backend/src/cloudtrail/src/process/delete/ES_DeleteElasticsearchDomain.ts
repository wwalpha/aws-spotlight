import { CloudTrail, Tables } from 'typings';

export const ES_DeleteElasticsearchDomain = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.domainStatus.aRN,
});
