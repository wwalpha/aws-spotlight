import { CloudTrail, Tables } from 'typings';

export const APIGATEWAY_DeleteRestApi = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const apiId = record.requestParameters.restApiId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:apigateway:${region}::/apis/${apiId}`,
  };
};
