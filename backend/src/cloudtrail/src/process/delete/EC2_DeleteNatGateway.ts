import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteNatGateway = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.DeleteNatGatewayResponse.natGatewayId,
});
