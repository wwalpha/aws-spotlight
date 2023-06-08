import { DeleteItemInput, GetItemInput, PutItemInput, QueryInput, UpdateInput } from '@alphax/dynamodb';
import { Environments } from '@src/consts';
import { Tables } from 'typings';

/** データ取得 */
export const get = (key: Tables.TResourceKey): GetItemInput => ({
  TableName: Environments.TABLE_NAME_RESOURCES,
  Key: key,
  ConsistentRead: true,
});

/** データ登録 */
export const put = (item: Tables.TResource): PutItemInput<Tables.TResource> => ({
  TableName: Environments.TABLE_NAME_RESOURCES,
  Item: item,
});

/** データ削除 */
export const del = (key: Tables.TResourceKey): DeleteItemInput => ({
  TableName: Environments.TABLE_NAME_RESOURCES,
  Key: {
    id: key.ResourceId,
  },
});

export const queryByName = (eventSource: string, name: string): QueryInput => ({
  TableName: Environments.TABLE_NAME_RESOURCES,
  KeyConditionExpression: '#EventSource = :EventSource',
  FilterExpression: '#ResourceName = :ResourceName',
  ExpressionAttributeNames: {
    '#EventSource': 'EventSource',
    '#ResourceName': 'ResourceName',
  },
  ExpressionAttributeValues: {
    ':EventSource': eventSource,
    ':ResourceName': name,
  },
  IndexName: 'gsiIdx1',
});

export const getListByEventSource = (eventSource: string, eventTime?: string): QueryInput => {
  const query: QueryInput = {
    TableName: Environments.TABLE_NAME_RESOURCES,
    ProjectionExpression: 'UserName, Service, ResourceName, ResourceId',
    KeyConditionExpression: '#EventSource = :EventSource',
    ExpressionAttributeNames: {
      '#EventSource': 'EventSource',
    },
    ExpressionAttributeValues: {
      ':EventSource': eventSource,
    },
    IndexName: 'gsiIdx1',
  };

  if (eventTime) {
    query.FilterExpression = '#EventTime < :EventTime';
    query.ExpressionAttributeNames = {
      ...query.ExpressionAttributeNames,
      '#EventTime': 'EventTime',
    };
    query.ExpressionAttributeValues = {
      ...query.ExpressionAttributeValues,
      ':EventTime': eventTime,
    };
  }

  return query;
};
