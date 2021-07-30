import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteCustomerGateway = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const customerGatewayId = record.requestParameters.customerGatewayId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:customer-gateway/${customerGatewayId}`,
  };
};
