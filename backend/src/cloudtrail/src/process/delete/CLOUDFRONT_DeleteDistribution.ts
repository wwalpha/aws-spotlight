import { CloudTrail, Tables } from 'typings';

export const CLOUDFRONT_DeleteDistribution = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const account = record.recipientAccountId;
  const id = record.requestParameters.id;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:cloudfront::${account}:distribution/${id}`,
  };
};
