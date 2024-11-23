import AWS from 'aws-sdk';
import { getHistory, getResource, scanResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as KINESIS from '@test/expect/kinesis';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('kinesis.amazonaws.com', () => {
  test('KINESIS_CreateStream', async () => {
    const event = await sendMessage(CreateEvents.KINESIS_CreateStream);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:kinesis:ap-northeast-1:999999999999:stream/engagement');
    const history = await getHistory({ EventId: '8d5d04c0-502b-40c5-a26b-862e67a1e77a' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(KINESIS.CreateStream_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(KINESIS.CreateStream_H);
  });

  test('KINESIS_DeleteStream', async () => {
    const event = await sendMessage(DeleteEvents.KINESIS_DeleteStream);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:kinesis:ap-northeast-1:999999999999:stream/engagement');
    const history = await getHistory({ EventId: 'd25d778d-9434-4097-bd61-ebaab3e98faa' });

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(KINESIS.DeleteStream_H);
  });

  test('KINESIS_CreateApplication', async () => {
    const event = await sendMessage(CreateEvents.KINESIS_CreateApplication);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:kinesisanalytics:ap-northeast-1:999999999999:application/KinesisDataAnalytics_Test'
    );
    const history = await getHistory({ EventId: CreateEvents.KINESIS_CreateApplication.eventID });

    fs.writeFileSync('./test/expect/kinesis/KINESIS_CreateApplication_R.json', JSON.stringify(resource));
    fs.writeFileSync('./test/expect/kinesis/KINESIS_CreateApplication_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.KINESIS_CreateApplication_R);

    expect(history).not.toBeUndefined();
    // expect(history).toEqual(EXPECTS.KINESIS_CreateApplication_H);
  });

  test('KINESIS_DeleteApplication', async () => {
    const event = await sendMessage(DeleteEvents.KINESIS_DeleteApplication);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:kinesisanalytics:ap-northeast-1:999999999999:application/KinesisDataAnalytics_Test'
    );
    const history = await getHistory({ EventId: DeleteEvents.KINESIS_DeleteApplication.eventID });

    fs.writeFileSync('./test/expect/kinesis/KINESIS_DeleteApplication_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    // expect(history).toEqual(EXPECTS.KINESIS_DeleteApplication_H);
  });
});
