// import { DeleteItemInput, GetItemInput, PutItemInput, QueryInput } from '@alphax/dynamodb';
// import { Consts } from '@src/apps/utils';
// import { Tables } from 'typings';

// /** データ取得 */
// export const get = (key: Tables.THistoryKey): GetItemInput => ({
//   TableName: Consts.Environments.TABLE_NAME_HISTORY,
//   Key: key,
// });

// /** データ登録 */
// export const put = (item: Tables.THistory): PutItemInput<Tables.THistory> => ({
//   TableName: Consts.Environments.TABLE_NAME_HISTORY,
//   Item: item,
// });

// /** データ削除 */
// export const del = (key: Tables.THistoryKey): DeleteItemInput => ({
//   TableName: Consts.Environments.TABLE_NAME_HISTORY,
//   Key: key,
// });

// export const listByEventName = (eventSource: string, eventName: string): QueryInput => ({
//   TableName: Consts.Environments.TABLE_NAME_HISTORY,
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
