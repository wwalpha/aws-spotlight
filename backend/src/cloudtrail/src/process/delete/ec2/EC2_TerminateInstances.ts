import { CloudTrail, Tables } from 'typings';

export const EC2_TerminateInstances = (record: CloudTrail.Record): Tables.ResouceGSI1Key[] => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;

  return (record.responseElements.instancesSet.items as any[]).map((item: { instanceId: any }) => ({
    EventSource: record.eventSource,
    ResourceId: `arn:aws:ec2:${region}:${account}:instance/${item.instanceId}`,
  }));
};
