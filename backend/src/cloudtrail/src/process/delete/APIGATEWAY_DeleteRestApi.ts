import { CloudTrail, Tables } from 'typings';

export const APIGATEWAY_DeleteRestApi = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.restApiId,
});
