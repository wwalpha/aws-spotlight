import { CloudTrail, Tables } from 'typings';

export const APIGATEWAY_DeleteRestApi = (record: CloudTrail.Record): Tables.ResourceKey => {
  const awsRegion = record.awsRegion;
  const apiId = record.requestParameters.restApiId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:apigateway:${awsRegion}::/apis/${apiId}`,
  };
};
