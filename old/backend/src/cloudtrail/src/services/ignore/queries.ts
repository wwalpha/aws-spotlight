// import { DeleteItemInput, GetItemInput, PutItemInput, QueryInput } from '@alphax/dynamodb';
// import { Consts } from '@src/apps/utils';
// import { Tables } from 'typings';

// /** データ取得 */
// export const get = (key: Tables.TIgnoreKey): GetItemInput => ({
//   TableName: Consts.Environments.TABLE_NAME_IGNORES,
//   Key: key,
// });

// /** データ登録 */
// export const put = (item: Tables.TIgnore): PutItemInput<Tables.TIgnore> => ({
//   TableName: Consts.Environments.TABLE_NAME_IGNORES,
//   Item: item,
// });

// /** データ削除 */
// export const del = (key: Tables.TIgnoreKey): DeleteItemInput => ({
//   TableName: Consts.Environments.TABLE_NAME_IGNORES,
//   Key: key,
// });

// export const listByEventName = (eventSource: string, eventName: string): QueryInput => ({
//   TableName: Consts.Environments.TABLE_NAME_IGNORES,
//   KeyConditionExpression: '#EventSource = :EventSource AND #EventName = :EventName',
//   ExpressionAttributeNames: {
//     '#EventSource': 'EventSource',
//     '#EventName': 'EventName',
//   },
//   ExpressionAttributeValues: {
//     ':EventSource': eventSource,
//     ':EventName': eventName,
//   },
//   IndexName: 'gsiIdx1',
// });
