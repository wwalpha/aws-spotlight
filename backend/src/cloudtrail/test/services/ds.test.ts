import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as DS from '@test/expect/ds';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('ds.amazonaws.com', () => {
  test('DS_CreateMicrosoftAD', async () => {
    const event = await sendMessage(CreateEvents.DS_CreateMicrosoftAD);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'ds.amazonaws.com',
      ResourceId: 'arn:aws:clouddirectory:ap-northeast-1:999999999999:directory/d-95671f95a5',
    });
    const history = await getHistory({ EventId: '1b73543a-da8b-4900-a27e-620a094085f4' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(DS.CreateMicrosoftAD_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(DS.CreateMicrosoftAD_H);
  });

  test('DS_DeleteDirectory', async () => {
    const event = await sendMessage(DeleteEvents.DS_DeleteDirectory);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'ds.amazonaws.com',
      ResourceId: 'arn:aws:clouddirectory:ap-northeast-1:999999999999:directory/d-95671f95a5',
    });
    const history = await getHistory({ EventId: 'd0fcee5a-ca83-4ff6-b6c3-ac41104b2aa0' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(DS.DeleteDirectory_H);
  });
});
