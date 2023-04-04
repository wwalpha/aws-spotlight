import { CloudTrail, Tables } from 'typings';

export const IAM_DeleteRole = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const account = record.recipientAccountId;
  const roleName = record.requestParameters.roleName;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:iam::${account}:role/${roleName}`,
  };
};
