import { defaultTo } from 'lodash';
import { CloudTrail, Tables } from 'typings';

export const APIGATEWAY_CreateRestApi = (record: CloudTrail.Record): Tables.Resource => {
  const region = record.awsRegion;
  const apiId = record.responseElements.id;

  return {
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: `arn:aws:apigateway:${region}::/apis/${apiId}`,
    ResourceName: record.responseElements.name,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: 'APIGateway',
  };
};
