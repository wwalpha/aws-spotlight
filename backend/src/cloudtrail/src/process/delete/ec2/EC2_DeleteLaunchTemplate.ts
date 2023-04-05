import { CloudTrail, Tables } from 'typings';

export const EC2_DeleteLaunchTemplate = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const launchTemplateId = record.requestParameters.DeleteLaunchTemplateRequest.LaunchTemplateId;

  return {
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:launch-template/${launchTemplateId}`,
  };
};
