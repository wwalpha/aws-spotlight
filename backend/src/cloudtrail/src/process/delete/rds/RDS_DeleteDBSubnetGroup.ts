import { CloudTrail, Tables } from 'typings';

export const RDS_DeleteDBSubnetGroup = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const subnetGroupName = record.requestParameters.dBSubnetGroupName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:rds:${region}:${account}:subgrp:${subnetGroupName}`,
  };
};
