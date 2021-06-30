import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteVpcEndpoints = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const vpcEndpointId = record.requestParameters.DeleteVpcEndpointsRequest.VpcEndpointId.content;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:vpc-endpoint/${vpcEndpointId}`,
  };
};
