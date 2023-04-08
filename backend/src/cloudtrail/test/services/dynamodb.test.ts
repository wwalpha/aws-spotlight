import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail } from '@src/index';
import * as EXPECTS from '@test/expect/dynamodb';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe.only('dynamodb.amazonaws.com', () => {
  test('CreateTable', async () => {
    const event = await sendMessage(CreateEvents.DYNAMODB_CreateTable);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:dynamodb:ap-northeast-1:999999999999:table/AutoNotification_AlarmConfigs'
    );
    const history = await getHistory({ EventId: '696c84dc-ad34-4abe-90dd-b69189934170' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CreateTable_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.CreateTable_H);
  });

  test('DeleteTable', async () => {
    const event = await sendMessage(DeleteEvents.DYNAMODB_DeleteTable);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:dynamodb:ap-northeast-1:999999999999:table/AutoNotification_AlarmConfigs'
    );
    const history = await getHistory({ EventId: '7bae1976-dd8e-4332-bc95-83c7844d515d' });

    // fs.writeFileSync('./test/expect/dynamodb/DYNAMODB_DeleteTable_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.DYNAMODB_DeleteTable_H);
  });
});
