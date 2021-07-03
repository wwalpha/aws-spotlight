import { CloudTrail, Tables } from 'typings';

export const APIGATEWAY_DeleteVpcLink = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const vpcLinkId = record.requestParameters.vpcLinkId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:apigateway:${region}::/vpclinks/${vpcLinkId}`,
  };
};
