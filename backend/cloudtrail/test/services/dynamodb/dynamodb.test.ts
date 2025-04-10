import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('dynamodb.amazonaws.com', () => {
  test('CreateTable', async () => {
    const event = await sendMessage(Events.DYNAMODB_CreateTable);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:dynamodb:ap-northeast-1:999999999999:table/AutoNotification_AlarmConfigs'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.DYNAMODB_CreateTable);
  });

  test('DeleteTable', async () => {
    const event = await sendMessage(Events.DYNAMODB_DeleteTable);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:dynamodb:ap-northeast-1:999999999999:table/AutoNotification_AlarmConfigs'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.DYNAMODB_DeleteTable);
  });
});
