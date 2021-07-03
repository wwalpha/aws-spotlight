import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as SNS from '@test/expect/sns';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('sns.amazonaws.com', () => {
  test('SNS_CreateTopic', async () => {
    const event = await sendMessage(CreateEvents.SNS_CreateTopic);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:sns:us-east-1:999999999999:arms-admin');
    const history = await getHistory({ EventId: '797afcaf-3870-4203-a1fc-f902bde6349b' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(SNS.CreateTopic_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(SNS.CreateTopic_H);
  });

  test('SNS_DeleteTopic', async () => {
    const event = await sendMessage(DeleteEvents.SNS_DeleteTopic);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:sns:ap-northeast-1:999999999999:arms-admin');
    const history = await getHistory({ EventId: '87a0bcf1-f5e2-4d1a-be9e-31923273cfa2' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(SNS.DeleteTopic_H);
  });
});
