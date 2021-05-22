// import { defaultTo } from 'lodash';
// import { CloudTrail, Tables } from 'typings';

// export const CreateTableGlue = (record: CloudTrail.Record): Tables.Resource => {
//   console.log('CreateTable Glue Response:', record.responseElements);

//   return {
//     UserName: defaultTo(record.userIdentity.userName, record.userIdentity.sessionContext.sessionIssuer.userName),
//     ResourceId: `${record.responseElements.databaseName}.${record.responseElements.tableInput.name}`,
//     ResourceName: `${record.responseElements.databaseName}.${record.responseElements.tableInput.name}`,
//     EventName: record.eventName,
//     EventSource: record.eventSource,
//     EventTime: `${record.eventTime}_${record.eventID.substr(0, 8)}`,
//     AWSRegion: record.awsRegion,
//     Type: record.userIdentity.type,
//     RequestParameters: record.requestParameters,
//     ResponseElements: record.responseElements,
//   };
// };
