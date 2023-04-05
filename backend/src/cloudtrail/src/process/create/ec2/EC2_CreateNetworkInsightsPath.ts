import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const EC2_CreateNetworkInsightsPath = (record: CloudTrail.Record): Tables.Resource => {
  const networkInsightsPathId =
    record.responseElements.CreateNetworkInsightsPathResponse.networkInsightsPath.networkInsightsPathId;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: record.responseElements.CreateNetworkInsightsPathResponse.networkInsightsPath.networkInsightsPathArn,
    ResourceName: networkInsightsPathId,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'EC2',
  };
};
