import { CloudTrail, Tables } from 'typings';

export const ROUTE53_DeleteHostedZone = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const id = record.requestParameters.id;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:route53:::hostedzone/${id}`,
  };
};
