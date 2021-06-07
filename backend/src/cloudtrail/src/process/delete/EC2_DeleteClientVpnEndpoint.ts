import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteClientVpnEndpoint = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.DeleteClientVpnEndpointRequest.ClientVpnEndpointId,
});
