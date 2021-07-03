import { CloudTrail, Tables } from 'typings';

export const FIREHOSE_DeleteDeliveryStream = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const deliveryStreamName = record.requestParameters.deliveryStreamName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:firehose:${region}:${account}:deliverystream/${deliveryStreamName}`,
  };
};
