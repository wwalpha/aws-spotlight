import * as RemoveService from '@src/process/RemoveService';
import * as CreateService from '@src/process/CreateService';
import * as UpdateService from '@src/process/UpdateService';
import { CloudTrail, Tables } from 'typings';
import { ErrorService, ResourceService, UnprocessedService } from '@src/services';
import { sendMail } from './utilities';

export const getCreateResourceItem = async (record: CloudTrail.Record): Promise<Tables.Resource[]> => {
  const records = CreateService.start(record);

  if (!records) return [];

  const checkExistTasks = records.map((item) =>
    ResourceService.describe({
      ResourceId: item.ResourceId,
    })
  );

  const results = await Promise.all(checkExistTasks);

  // すでに存在しているの場合は、エラー通知
  const dataRows = results.filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  if (dataRows.length !== 0) {
    // await sendMail('Resource Exist', `${record.eventSource}\n${record.eventName}\n${dataRows[0].ResourceId}`);

    const registTasks = dataRows.map((item) =>
      UnprocessedService.regist({
        EventName: item.EventName,
        EventTime: `${item.EventTime}_${item.EventId.substring(0, 8)}`,
        EventSource: item.EventSource,
        Raw: JSON.stringify(record),
      })
    );

    await Promise.all(registTasks);

    // 処理しない
    return [];
  }

  return records;
};

export const getUpdateResourceItem = async (record: CloudTrail.Record): Promise<Tables.Resource[]> => {
  // リソース情報を揃える
  const resource = UpdateService.start(record);

  // イベント未実装
  if (!resource) return [];

  // 既存データを検索する
  const dataRow = await ResourceService.describe({
    ResourceId: resource.ResourceId,
  });

  // 既存データないの場合は、新規作成する
  if (!dataRow) {
    return [resource];
  }

  // 過去の作成時間は無視する
  if (dataRow.EventTime > resource.EventTime) {
    return [];
  }

  // リソース情報
  return [resource];
};

export const getRemoveResourceItems = async (record: CloudTrail.Record): Promise<Tables.ResourceKey[]> => {
  const items = RemoveService.start(record);

  if (!items) return [];

  const tasks = items.map(async (item) => {
    const resource = await ResourceService.describe({
      ResourceId: item.ResourceId,
    });

    // リソースが存在する場合は、そのまま実行する
    if (resource) return item;

    // 未処理に登録する
    await UnprocessedService.regist({
      EventName: record.eventName,
      EventSource: record.eventSource,
      EventTime: `${record.eventTime}_${record.eventID.substring(0, 8)}`,
      Raw: JSON.stringify(record),
    });

    return undefined;
  });

  // get all rows
  const results = await Promise.all(tasks);

  // merge all records
  return results.filter((item): item is Exclude<typeof item, undefined> => item !== undefined);
};
