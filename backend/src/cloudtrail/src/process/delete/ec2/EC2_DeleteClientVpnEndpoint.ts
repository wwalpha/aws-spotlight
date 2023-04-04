import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteClientVpnEndpoint = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const clientVpnEndpointId = record.requestParameters.DeleteClientVpnEndpointRequest.ClientVpnEndpointId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:client-vpn-endpoint/${clientVpnEndpointId}`,
  };
};
