import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as SQS from '@test/expect/sqs';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('sqs.amazonaws.com', () => {
  test('SQS_CreateQueue', async () => {
    const event = await sendMessage(CreateEvents.SQS_CreateQueue);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:sqs:us-east-1:999999999999:arms-deadletter');
    const history = await getHistory({ EventId: '62ae74bb-c4f8-43fb-9a82-02b762bfdbe5' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(SQS.CreateQueue_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(SQS.CreateQueue_H);
  });

  test('SQS_DeleteQueue', async () => {
    const event = await sendMessage(DeleteEvents.SQS_DeleteQueue);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:sqs:us-east-1:999999999999:arms-deadletter');
    const history = await getHistory({ EventId: '0114a86d-87b7-4102-97b2-53a77d228154' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(SQS.DeleteQueue_H);
  });
});
