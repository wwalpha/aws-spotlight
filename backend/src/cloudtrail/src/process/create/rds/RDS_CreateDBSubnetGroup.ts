import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const RDS_CreateDBSubnetGroup = (record: CloudTrail.Record): Tables.Resource => {
  const dBSubnetGroupArn = record.responseElements.dBSubnetGroupArn;
  const dBSubnetGroupName = record.responseElements.dBSubnetGroupName;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: dBSubnetGroupArn,
    ResourceName: dBSubnetGroupName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'RDS',
  };
};
