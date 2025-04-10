import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('kinesis.amazonaws.com', () => {
  test('KINESIS_CreateStream', async () => {
    const event = await sendMessage(Events.KINESIS_CreateStream);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:kinesis:ap-northeast-1:999999999999:stream/engagement');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.KINESIS_CreateStream);
  });

  test('KINESIS_DeleteStream', async () => {
    const event = await sendMessage(Events.KINESIS_DeleteStream);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:kinesis:ap-northeast-1:999999999999:stream/engagement');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.KINESIS_DeleteStream);
  });

  test('KINESIS_CreateApplication', async () => {
    const event = await sendMessage(Events.KINESIS_CreateApplication);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:kinesisanalytics:ap-northeast-1:999999999999:application/KinesisDataAnalytics_Test'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.KINESIS_CreateApplication);
  });

  test('KINESIS_DeleteApplication', async () => {
    const event = await sendMessage(Events.KINESIS_DeleteApplication);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:kinesisanalytics:ap-northeast-1:999999999999:application/KinesisDataAnalytics_Test'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.KINESIS_DeleteApplication);
  });
});
