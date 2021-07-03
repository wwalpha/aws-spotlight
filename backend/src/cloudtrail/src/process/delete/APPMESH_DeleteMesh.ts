import { CloudTrail, Tables } from 'typings';

export const APPMESH_DeleteMesh = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.mesh.metadata.arn,
});
