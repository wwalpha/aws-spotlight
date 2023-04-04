import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const CODEDEPLOY_CreateApplication = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const applicationName = record.requestParameters.applicationName;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:codedeploy:${region}:${account}:application/${applicationName}`,
    ResourceName: applicationName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'CodeDeploy Application',
  };
};
