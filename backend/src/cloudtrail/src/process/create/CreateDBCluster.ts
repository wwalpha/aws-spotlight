// import { defaultTo } from 'lodash';
// import { CloudTrail, Tables } from 'typings';

// export const CreateDBCluster = (record: CloudTrail.Record): Tables.Resource => {
//   console.log('CreateDBCluster Response:', record.responseElements);

//   return {
//     UserName: defaultTo(record.userIdentity.userName, record.userIdentity.sessionContext.sessionIssuer.userName),
//     ResourceId: record.responseElements.dBClusterIdentifier,
//     ResourceName: record.responseElements.dBClusterIdentifier,
//     EventName: record.eventName,
//     EventSource: record.eventSource,
//     EventTime: `${record.eventTime}_${record.eventID.substr(0, 8)}`,
//     AWSRegion: record.awsRegion,
//     Type: record.userIdentity.type,
//     RequestParameters: record.requestParameters,
//     ResponseElements: record.responseElements,
//   };
// };
