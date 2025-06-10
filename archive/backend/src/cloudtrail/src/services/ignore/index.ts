// import { DynamodbHelper } from '@src/apps/utils';
// import { Tables } from 'typings';
// import * as Queries from './queries';

// /** 詳細取得 */
// export const describe = async (key: Tables.TIgnoreKey): Promise<Tables.TIgnore | undefined> => {
//   const results = await DynamodbHelper.get<Tables.TIgnore>(Queries.get(key));

//   return results?.Item;
// };

// /** 内容更新 */
// export const regist = async (item: Tables.TIgnore): Promise<void> => {
//   await DynamodbHelper.put(Queries.put(item));
// };

// /** 内容更新 */
// export const update = async (item: Tables.TIgnore): Promise<void> => {
//   const groupInfo = await describe({
//     EventId: item.EventId,
//   });

//   // if exists
//   if (!groupInfo) {
//     throw new Error(`Ignore not exists. ${item.EventId}`);
//   }

//   await DynamodbHelper.put(Queries.put(item));
// };

// /** グループ削除 */
// export const remove = async (key: Tables.TIgnoreKey): Promise<void> => {
//   await DynamodbHelper.delete(Queries.del(key));
// };

// /** イベント一覧取得 */
// export const listByEventName = async (eventSource: string, eventName: string): Promise<Tables.TIgnore[]> => {
//   const res = await DynamodbHelper.query<Tables.TIgnore>(Queries.listByEventName(eventSource, eventName));

//   return res.Items || [];
// };
