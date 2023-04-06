import * as RemoveService from '@src/process/RemoveService';
import * as CreateService from '@src/process/CreateService';
import * as UpdateService from '@src/process/UpdateService';
import { CloudTrail, Tables } from 'typings';
import { Consts, DynamodbHelper } from '.';
import { ErrorService, ResourceService } from '@src/services';
import { sendMail } from './utilities';

export const getCreateResourceItem = async (record: CloudTrail.Record): Promise<Tables.Resource[]> => {
  const items = CreateService.start(record);

  if (!items) return [];

  const results = await Promise.all(
    items.map((item) =>
      ResourceService.describe({
        ResourceId: item.ResourceId,
      })
    )
  );

  // すでに存在しているの場合は、エラー通知
  const dataRows = results.filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  if (dataRows.length !== 0) {
    await sendMail('Resource Exist', `${dataRows[0].EventSource}\n${dataRows[0].EventName}\n${dataRows[0].ResourceId}`);

    const registTasks = dataRows.map((item) =>
      ErrorService.regist({
        EventName: item.EventName,
        EventTime: item.EventTime,
        EventSource: item.EventSource,
        Raw: JSON.stringify(record),
      })
    );

    await Promise.all(registTasks);

    // 処理しない
    return [];
  }

  return items;
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

export const getRemoveResourceItems = async (record: CloudTrail.Record): Promise<Tables.Resource[]> => {
  const items = RemoveService.start(record);

  if (!items) return [];

  const tasks = items.map((item) =>
    DynamodbHelper.query<Tables.Resource>({
      TableName: Consts.Environments.TABLE_NAME_RESOURCES,
      KeyConditionExpression: 'ResourceId = :ResourceId',
      ExpressionAttributeValues: {
        ':ResourceId': item.ResourceId,
      },
    })
  );

  // get all rows
  const results = await Promise.all(tasks);

  // merge all records
  return results.reduce((prev, curr) => {
    if (curr.Items.length === 0) return prev;

    return [...prev, curr.Items[0]];
  }, [] as Tables.Resource[]);
};
