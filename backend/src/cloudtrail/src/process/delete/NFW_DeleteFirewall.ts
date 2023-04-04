import { CloudTrail, Tables } from 'typings';

export const NFW_DeleteFirewall = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.responseElements.firewall.firewallArn,
});
