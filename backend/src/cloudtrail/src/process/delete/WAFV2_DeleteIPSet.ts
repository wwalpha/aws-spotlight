import { CloudTrail, Tables } from 'typings';

export const WAFV2_DeleteIPSet = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const scope = (record.requestParameters.scope as string).toLowerCase();
  const name = record.requestParameters.name;
  const id = record.requestParameters.id;

  //test-queue
  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:wafv2:${region}:${account}:${scope}/ipset/${name}/${id}`,
  };
};
