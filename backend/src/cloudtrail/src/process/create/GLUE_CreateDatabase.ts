import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const GLUE_CreateDatabase = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const databaseName = record.requestParameters.databaseInput.name;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:glue:${region}:${account}:database/${databaseName}`,
    ResourceName: databaseName,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'Glue',
  };
};
