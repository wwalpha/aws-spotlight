import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteVpcPeeringConnection = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.vpcPeeringConnectionId,
});
