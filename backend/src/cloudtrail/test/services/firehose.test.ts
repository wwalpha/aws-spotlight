import AWS from 'aws-sdk';
import { getHistory, getResource, scanHistory, scanResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as FIREHOSE from '@test/expect/firehose';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('firehose.amazonaws.com', () => {
  test('FIREHOSE_CreateDeliveryStream', async () => {
    const event = await sendMessage(CreateEvents.FIREHOSE_CreateDeliveryStream);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:firehose:us-east-1:999999999999:deliverystream/firehose');
    const history = await getHistory({ EventId: '127aa5f6-6a9a-49ad-8178-ab768f1206aa' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(FIREHOSE.CreateDeliveryStream_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(FIREHOSE.CreateDeliveryStream_H);
  });

  test('FIREHOSE_DeleteDeliveryStream', async () => {
    const event = await sendMessage(DeleteEvents.FIREHOSE_DeleteDeliveryStream);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:firehose:us-east-1:999999999999:deliverystream/firehose');
    const history = await getHistory({ EventId: '880cb754-d38d-4f30-88aa-1f167ded8990' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(FIREHOSE.DeleteDeliveryStream_H);
  });
});
