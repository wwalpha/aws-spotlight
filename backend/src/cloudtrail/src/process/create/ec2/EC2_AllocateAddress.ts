import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const EC2_AllocateAddress = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const allocationId = record.responseElements.allocationId;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:ec2:${region}:${account}:elastic-ip/${allocationId}`,
    ResourceName: record.responseElements.publicIp,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'Elastic IP',
  };
};
