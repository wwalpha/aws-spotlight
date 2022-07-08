import { CloudTrail, Tables } from 'typings';

export const TRANSFER_DeleteServer = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const serverId = record.requestParameters.serverId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:transfer:${region}:${account}:server/${serverId}`,
  };
};
