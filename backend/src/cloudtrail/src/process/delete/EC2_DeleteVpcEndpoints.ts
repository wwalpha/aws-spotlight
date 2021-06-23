import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteVpcEndpoints = (record: CloudTrail.Record): Tables.ResourceKey => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.DeleteVpcEndpointsRequest.VpcEndpointId.content,
});
