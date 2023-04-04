import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const EC2_CreateVpcPeeringConnection = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const vpcPeeringConnectionId = record.responseElements.vpcPeeringConnection.vpcPeeringConnectionId;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:ec2:${region}:${account}:vpc-peering-connection/${vpcPeeringConnectionId}`,
    ResourceName: vpcPeeringConnectionId,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'VPC Peering',
  };
};
