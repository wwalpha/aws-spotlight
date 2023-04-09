import { DynamoDB } from 'aws-sdk';
import { ResourceService } from '@src/services';
import * as RemoveService from '@src/process/RemoveService';
import * as CreateService from '@src/process/CreateService';
import * as UpdateService from '@src/process/UpdateService';
import { CloudTrail, Tables } from 'typings';
import { Consts, Utilities } from '.';
import _ from 'lodash';

export const getCreateResourceItems = async (record: CloudTrail.Record): Promise<DynamoDB.TransactWriteItemList> => {
  const items = CreateService.start(record) ?? [];
  const rets: DynamoDB.TransactWriteItemList = [];

  // 対象データなし
  if (items.length === 0) return rets;

  const { TABLE_NAME_RESOURCES, TABLE_NAME_UNPROCESSED, TABLE_NAME_HISTORY } = Consts.Environments;

  // 既存データ検索
  const results = await Promise.all(
    items.map((item) =>
      ResourceService.describe({
        ResourceId: item.ResourceId,
      })
    )
  );

  // すでに存在している場合は、未処理から削除する
  const dataRows = results.filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  // 既存データ存在しない、存在データ件数不一致
  if (dataRows.length === 0 || items.length !== dataRows.length) {
    // リソース追加
    items.map((item) => rets.push(Utilities.getPutRecord(TABLE_NAME_RESOURCES, item)));

    // 未処理削除
    rets.push(Utilities.getDeleteRecord(TABLE_NAME_UNPROCESSED, Utilities.getRemoveUnprocessed(record)));
    // 履歴追加
    rets.push(Utilities.getPutRecord(TABLE_NAME_HISTORY, Utilities.getHistoryItem(record)));

    return rets;
  }

  // 既存データ存在する場合
  const sameResource = dataRows.filter((item) => item.EventId === record.eventID);

  // 同じイベントの場合、未処理データを削除する
  if (sameResource.length !== 0) {
    // 未処理削除
    rets.push(Utilities.getDeleteRecord(TABLE_NAME_UNPROCESSED, Utilities.getRemoveUnprocessed(record)));
  }

  return rets;
};

export const getUpdateResourceItems = async (record: CloudTrail.Record): Promise<DynamoDB.TransactWriteItemList> => {
  const items = UpdateService.start(record) ?? [];
  const rets: DynamoDB.TransactWriteItemList = [];

  // 対象データなし
  if (items.length === 0) return rets;

  const { TABLE_NAME_RESOURCES, TABLE_NAME_UNPROCESSED, TABLE_NAME_HISTORY } = Consts.Environments;

  const tasks = items.map(async (item) => {
    // 既存データを検索する
    const dataRow = await ResourceService.describe({
      ResourceId: item.ResourceId,
    });

    // 既存データないの場合は、新規作成する
    if (!dataRow) {
      item.Revisions = [item.EventTime];
      item.Status = Consts.ResourceStatus.CREATED;

      rets.push(Utilities.getPutRecord(TABLE_NAME_RESOURCES, item));
      return;
    }

    // 既存データある場合は、履歴を追加する
    const revisions = [...dataRow.Revisions!, item.EventTime];
    dataRow.Revisions = _.sortBy(revisions);

    // 削除処理
    if (record.eventName.toUpperCase().startsWith('DELETE')) {
      const index = dataRow.Revisions.findIndex((r) => r === item.EventTime);

      // 最後の場合、削除フラグ
      if (index + 1 === revisions.length) {
        dataRow.Status = Consts.ResourceStatus.DELETE;
      }
    }

    rets.push(Utilities.getPutRecord(TABLE_NAME_RESOURCES, dataRow));
  });

  // 処理実行する
  await Promise.all(tasks);

  // 処理リソースがある場合、履歴などを追加する
  if (rets.length !== 0) {
    // 未処理削除
    rets.push(Utilities.getDeleteRecord(TABLE_NAME_UNPROCESSED, Utilities.getRemoveUnprocessed(record)));
    // 履歴追加
    rets.push(Utilities.getPutRecord(TABLE_NAME_HISTORY, Utilities.getHistoryItem(record)));
  }

  return rets;
};

export const getRemoveResourceItems = async (record: CloudTrail.Record): Promise<DynamoDB.TransactWriteItemList> => {
  const items = RemoveService.start(record) ?? [];
  const rets: DynamoDB.TransactWriteItemList = [];

  // 対象データなし
  if (items.length === 0) return rets;

  const { TABLE_NAME_RESOURCES, TABLE_NAME_UNPROCESSED, TABLE_NAME_HISTORY } = Consts.Environments;

  const tasks = items.map(async (item) => {
    const resource = await ResourceService.describe({
      ResourceId: item.ResourceId,
    });

    // リソース存在しない場合は、処理終了
    if (!resource) return;

    // リソース存在する場合は
    // リソース削除
    rets.push(Utilities.getDeleteRecord(TABLE_NAME_RESOURCES, item));
    // 未処理削除
    rets.push(Utilities.getDeleteRecord(TABLE_NAME_UNPROCESSED, Utilities.getRemoveUnprocessed(record)));
    // 履歴追加
    rets.push(Utilities.getPutRecord(TABLE_NAME_HISTORY, Utilities.getHistoryItem(record)));
  });

  // 検知処理を実行する
  await Promise.all(tasks);

  return rets;
};
