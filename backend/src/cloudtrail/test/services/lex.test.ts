import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as LEX from '@test/expect/lex';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('lex.amazonaws.com', () => {
  test('LEX_CreateBot', async () => {
    const event = await sendMessage(CreateEvents.LEX_CreateBot);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:lex:ap-northeast-1:999999999999:bot:YHPF209BAD');
    const history = await getHistory({ EventId: '492f355d-c713-4e57-b26e-288b814fbd30' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(LEX.CreateBot_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(LEX.CreateBot_H);
  });

  test('LEX_DeleteBot', async () => {
    const event = await sendMessage(DeleteEvents.LEX_DeleteBot);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:lex:ap-northeast-1:999999999999:bot:YHPF209BAD');
    const history = await getHistory({ EventId: 'fb453f66-df39-403a-83fe-0f5404bc2ef8' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(LEX.DeleteBot_H);
  });
});
