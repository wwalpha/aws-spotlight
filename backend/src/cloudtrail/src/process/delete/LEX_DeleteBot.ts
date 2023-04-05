import { CloudTrail, Tables } from 'typings';

export const LEX_DeleteBot = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const name = record.requestParameters.name;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:lex:${region}:${account}:bot:${name}`,
  };
};
