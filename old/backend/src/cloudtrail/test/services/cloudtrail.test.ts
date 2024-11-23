import AWS from 'aws-sdk';
import {
  getHistory,
  getResource,
  getUnprocessed,
  receiveMessage,
  receiveMessageData,
  sendMessageOnly,
  trancateAll,
} from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

const EVENT_SOURCE = 'ec2.amazonaws.com';

describe(EVENT_SOURCE, () => {
  afterEach(async () => {
    await trancateAll();
  });

  test('Normal Process', async () => {
    await sendMessageOnly([DeleteEvents.DYNAMODB_DeleteTable, CreateEvents.DYNAMODB_CreateTable]);

    await cloudtrail(await receiveMessageData());

    const dynamodb = await getResource(
      'arn:aws:dynamodb:ap-northeast-1:999999999999:table/AutoNotification_AlarmConfigs'
    );
    const createHistory = await getHistory({ EventId: CreateEvents.DYNAMODB_CreateTable.eventID });
    const deleteHistory = await getHistory({ EventId: DeleteEvents.DYNAMODB_DeleteTable.eventID });

    const createProcessed = await getUnprocessed({
      EventName: CreateEvents.DYNAMODB_CreateTable.eventName,
      EventTime: `${CreateEvents.DYNAMODB_CreateTable.eventTime}_${CreateEvents.DYNAMODB_CreateTable.eventID.substring(
        0,
        8
      )}`,
    });
    const deleteProcessed = await getUnprocessed({
      EventName: DeleteEvents.DYNAMODB_DeleteTable.eventName,
      EventTime: `${DeleteEvents.DYNAMODB_DeleteTable.eventTime}_${DeleteEvents.DYNAMODB_DeleteTable.eventID.substring(
        0,
        8
      )}`,
    });

    expect(dynamodb).toBeUndefined();
    expect(createHistory).not.toBeUndefined();
    expect(deleteHistory).not.toBeUndefined();
    expect(createProcessed).toBeUndefined();
    expect(deleteProcessed).toBeUndefined();
  });

  test('Unnormal Process', async () => {
    const removeTable = DeleteEvents.DYNAMODB_DeleteTable;
    removeTable.responseElements.tableDescription.tableArn =
      'arn:aws:dynamodb:ap-northeast-1:999999999999:table/AutoNotification_AlarmConfigs2';

    await sendMessageOnly([removeTable, CreateEvents.DYNAMODB_CreateTable]);

    await cloudtrail(await receiveMessageData());

    const dynamodb = await getResource(
      'arn:aws:dynamodb:ap-northeast-1:999999999999:table/AutoNotification_AlarmConfigs'
    );
    const createHistory = await getHistory({ EventId: CreateEvents.DYNAMODB_CreateTable.eventID });
    const deleteHistory = await getHistory({ EventId: DeleteEvents.DYNAMODB_DeleteTable.eventID });

    const createProcessed = await getUnprocessed({
      EventName: CreateEvents.DYNAMODB_CreateTable.eventName,
      EventTime: `${CreateEvents.DYNAMODB_CreateTable.eventTime}_${CreateEvents.DYNAMODB_CreateTable.eventID.substring(
        0,
        8
      )}`,
    });
    const deleteProcessed = await getUnprocessed({
      EventName: DeleteEvents.DYNAMODB_DeleteTable.eventName,
      EventTime: `${DeleteEvents.DYNAMODB_DeleteTable.eventTime}_${DeleteEvents.DYNAMODB_DeleteTable.eventID.substring(
        0,
        8
      )}`,
    });

    expect(dynamodb).not.toBeUndefined();
    expect(createHistory).not.toBeUndefined();
    expect(deleteHistory).toBeUndefined();
    expect(createProcessed).toBeUndefined();
    expect(deleteProcessed).not.toBeUndefined();
  });

  test('Delete Only', async () => {
    await sendMessageOnly([DeleteEvents.DYNAMODB_DeleteTable]);

    await cloudtrail(await receiveMessageData());

    const dynamodb = await getResource(
      'arn:aws:dynamodb:ap-northeast-1:999999999999:table/AutoNotification_AlarmConfigs'
    );
    const deleteHistory = await getHistory({ EventId: DeleteEvents.DYNAMODB_DeleteTable.eventID });

    const deleteProcessed = await getUnprocessed({
      EventName: DeleteEvents.DYNAMODB_DeleteTable.eventName,
      EventTime: `${DeleteEvents.DYNAMODB_DeleteTable.eventTime}_${DeleteEvents.DYNAMODB_DeleteTable.eventID.substring(
        0,
        8
      )}`,
    });

    expect(dynamodb).toBeUndefined();
    expect(deleteHistory).toBeUndefined();
    expect(deleteProcessed).not.toBeUndefined();
  });

  test('Create Only', async () => {
    await sendMessageOnly([CreateEvents.DYNAMODB_CreateTable]);

    await cloudtrail(await receiveMessageData());

    const dynamodb = await getResource(
      'arn:aws:dynamodb:ap-northeast-1:999999999999:table/AutoNotification_AlarmConfigs'
    );
    const createHistory = await getHistory({ EventId: CreateEvents.DYNAMODB_CreateTable.eventID });

    const createProcessed = await getUnprocessed({
      EventName: CreateEvents.DYNAMODB_CreateTable.eventName,
      EventTime: `${CreateEvents.DYNAMODB_CreateTable.eventTime}_${CreateEvents.DYNAMODB_CreateTable.eventID.substring(
        0,
        8
      )}`,
    });

    expect(dynamodb).not.toBeUndefined();
    expect(createHistory).not.toBeUndefined();
    expect(createProcessed).toBeUndefined();
  });
});
