import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteNatGateway = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.DeleteNatGatewayResponse.natGatewayId,
});
