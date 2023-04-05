import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const EC2_RunInstances = (record: CloudTrail.Record): Tables.Resource[] => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;

  return record.responseElements.instancesSet.items.map(
    (item: { instanceId: any }) =>
      ({
        UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
        ResourceId: `arn:aws:ec2:${region}:${account}:instance/${item.instanceId}`,
        ResourceName: item.instanceId,
        EventName: record.eventName,
        EventSource: record.eventSource,
        EventTime: record.eventTime,
        AWSRegion: record.awsRegion,
        IdentityType: record.userIdentity.type,
        UserAgent: record.userAgent,
        EventId: record.eventID,
        Service: 'EC2',
      } as Tables.Resource)
  );
};
