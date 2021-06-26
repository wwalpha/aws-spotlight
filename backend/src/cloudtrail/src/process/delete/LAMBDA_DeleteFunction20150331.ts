import { CloudTrail, Tables } from 'typings';

export const LAMBDA_DeleteFunction20150331 = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const awsRegion = record.awsRegion;
  const accountId = record.recipientAccountId;
  const functionName = record.requestParameters.functionName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:lambda:${awsRegion}:${accountId}:function:${functionName}`,
  };
};
