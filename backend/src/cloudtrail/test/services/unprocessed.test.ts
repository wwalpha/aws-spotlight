import AWS from 'aws-sdk';
import {
  getHistory,
  getResource,
  getUnprocessed,
  trancateAll,
  sendMessageOnly,
  receiveMessageData,
  registUnprocessed,
  scanResource,
} from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail, unprocessed } from '@src/index';

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

  test('Remove Resource Successful', async () => {
    await sendMessageOnly([CreateEvents.DYNAMODB_CreateTable]);
    await cloudtrail(await receiveMessageData());

    let deleteProcessed = await getUnprocessed({
      EventName: DeleteEvents.DYNAMODB_DeleteTable.eventName,
      EventTime: `${DeleteEvents.DYNAMODB_DeleteTable.eventTime}_${DeleteEvents.DYNAMODB_DeleteTable.eventID.substring(
        0,
        8
      )}`,
    });
    let dynamodb = await getResource(
      'arn:aws:dynamodb:ap-northeast-1:999999999999:table/AutoNotification_AlarmConfigs'
    );

    expect(deleteProcessed).toBeUndefined();
    expect(dynamodb).not.toBeUndefined();

    await registUnprocessed({
      EventName: DeleteEvents.DYNAMODB_DeleteTable.eventName,
      EventSource: DeleteEvents.DYNAMODB_DeleteTable.eventSource,
      EventTime: `${DeleteEvents.DYNAMODB_DeleteTable.eventTime}_${DeleteEvents.DYNAMODB_DeleteTable.eventID.substring(
        0,
        8
      )}`,
      ResourceId: 'arn:aws:dynamodb:ap-northeast-1:999999999999:table/AutoNotification_AlarmConfigs',
      Raw: JSON.stringify(DeleteEvents.DYNAMODB_DeleteTable),
    });

    await unprocessed();

    dynamodb = await getResource('arn:aws:dynamodb:ap-northeast-1:999999999999:table/AutoNotification_AlarmConfigs');

    const deleteHistory = await getHistory({ EventId: DeleteEvents.DYNAMODB_DeleteTable.eventID });
    deleteProcessed = await getUnprocessed({
      EventName: DeleteEvents.DYNAMODB_DeleteTable.eventName,
      EventTime: `${DeleteEvents.DYNAMODB_DeleteTable.eventTime}_${DeleteEvents.DYNAMODB_DeleteTable.eventID.substring(
        0,
        8
      )}`,
    });

    expect(dynamodb).toBeUndefined();
    expect(deleteProcessed).toBeUndefined();
    expect(deleteHistory).not.toBeUndefined();
  });
});
