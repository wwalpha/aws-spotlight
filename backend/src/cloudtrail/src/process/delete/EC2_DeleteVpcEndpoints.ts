import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteVpcEndpoints = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.DeleteVpcEndpointsRequest.VpcEndpointId.content,
});
