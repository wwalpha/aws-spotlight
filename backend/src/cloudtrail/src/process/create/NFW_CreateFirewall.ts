import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const NFW_CreateFirewall = (record: CloudTrail.Record): Tables.Resource => {
  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: record.responseElements.firewall.firewallArn,
    ResourceName: record.responseElements.firewall.firewallName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'NetworkFirewall',
  };
};
