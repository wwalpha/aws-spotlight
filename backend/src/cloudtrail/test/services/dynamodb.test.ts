import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import DYNAMODB_CreateTable from '../datas/create/DYNAMODB_CreateTable.json';
import DYNAMODB_DeleteTable from '../datas/delete/DYNAMODB_DeleteTable.json';
import { cloudtrail } from '@src/index';
import * as DYNAMODB from '@test/expect/dynamodb';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe.only('dynamodb.amazonaws.com', () => {
  test('CreateTable', async () => {
    const event = await sendMessage(DYNAMODB_CreateTable);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'dynamodb.amazonaws.com',
      ResourceId: 'AutoNotification_AlarmConfigs',
    });
    const history = await getHistory({ EventId: '696c84dc-ad34-4abe-90dd-b69189934170' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(DYNAMODB.CreateTable_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(DYNAMODB.CreateTable_H);
  });

  test('DeleteTable', async () => {
    const event = await sendMessage(DYNAMODB_DeleteTable);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'dynamodb.amazonaws.com',
      ResourceId: 'AutoNotification_AlarmConfigs',
    });
    const history = await getHistory({ EventId: '7bae1976-dd8e-4332-bc95-83c7844d515d' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(DYNAMODB.DeleteTable_H);
  });
});
