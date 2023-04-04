import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteNetworkInsightsPath = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const networkInsightsPathId = record.responseElements.DeleteNetworkInsightsPathResponse.networkInsightsPathId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:network-insights-path/${networkInsightsPathId}`,
  };
};
