import * as RemoveService from '@src/process/RemoveService';
import * as CreateService from '@src/process/CreateService';
import * as UpdateService from '@src/process/UpdateService';
import { CloudTrail, Tables } from 'typings';
import { ResourceService, UnprocessedService } from '@src/services';
import _ from 'lodash';
import { Logger } from './utilities';
import { Consts } from '.';

export const getCreateResourceItem = async (record: CloudTrail.Record): Promise<Tables.TResource[]> => {
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

export const getUpdateResourceItem = async (record: CloudTrail.Record): Promise<Tables.TResource[]> => {
  // リソース情報を揃える
  const resource = UpdateService.start(record);

  // イベント未実装
  if (!resource) return [];

  const tasks = resource.map(async (item) => {
    // 既存データを検索する
    const dataRow = await ResourceService.describe({
      ResourceId: item.ResourceId,
    });

    // 既存データないの場合は、新規作成する
    if (!dataRow) {
      item.Revisions = [item.EventTime];
      item.Status = Consts.ResourceStatus.CREATED;
      return item;
    }

    const revisions = [...dataRow.Revisions!, item.EventTime];

    // 履歴を追加する
    dataRow.Revisions = _.sortBy(revisions);

    // 削除処理
    if (record.eventName.toUpperCase().startsWith('DELETE')) {
      const index = dataRow.Revisions.findIndex((r) => r === item.EventTime);

      // 最後の場合、削除フラグ
      if (index + 1 === revisions.length) {
        dataRow.Status = Consts.ResourceStatus.DELETE;
      }
    }

    // リソース情報
    return dataRow;
  });

  return await Promise.all(tasks);
};

export const getRemoveResourceItems = async (record: CloudTrail.Record): Promise<Tables.TResourceKey[]> => {
  const items = RemoveService.start(record);

  if (!items) return [];

  const tasks = items.map(async (item) => {
    const resource = await ResourceService.describe({
      ResourceId: item.ResourceId,
    });

    Logger.debug(`Resource exist check: ${resource}`);

    // リソースが存在する場合は、そのまま実行する
    if (resource) return item;

    // 未処理に登録する
    await UnprocessedService.regist({
      EventName: record.eventName,
      EventSource: record.eventSource,
      EventTime: `${record.eventTime}_${record.eventID.substring(0, 8)}`,
      Raw: JSON.stringify(record),
    });

    Logger.debug('Unprocessed registed');

    return undefined;
  });

  // get all rows
  const results = await Promise.all(tasks);

  // merge all records
  return results.filter((item): item is Exclude<typeof item, undefined> => item !== undefined);
};
