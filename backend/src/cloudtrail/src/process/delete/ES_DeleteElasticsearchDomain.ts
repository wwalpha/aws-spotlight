import { CloudTrail, Tables } from 'typings';

export const ES_DeleteElasticsearchDomain = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.domainStatus.aRN,
});
