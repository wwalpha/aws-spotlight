import { CloudTrail, Tables } from 'typings';

export const SQS_DeleteQueue = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const queueUrl: string = record.requestParameters.queueUrl;
  const queueName = queueUrl.split('/')[queueUrl.split('/').length - 1];

  //test-queue
  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:sqs:${region}:${account}:${queueName}`,
  };
};
