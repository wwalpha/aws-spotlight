import { CloudTrail, Tables } from 'typings';

export const LAMBDA_DeleteFunction20150331 = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const functionName = record.requestParameters.functionName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:lambda:${region}:${account}:function:${functionName}`,
  };
};
