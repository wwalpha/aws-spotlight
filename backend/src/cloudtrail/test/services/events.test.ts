import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail } from '@src/index';
import * as EXPECTS from '@test/expect/events';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe.skip('events.amazonaws.com', () => {
  test('EVENTS_PutRule', async () => {
    const event = await sendMessage(CreateEvents.EVENTS_PutRule);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:events:ap-northeast-1:999999999999:rule/ARMS_UnprocessedRule');
    const history = await getHistory({ EventId: CreateEvents.EVENTS_PutRule.eventID });

    // fs.writeFileSync('./test/expect/events/EVENTS_PutRule_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/events/EVENTS_PutRule_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.EVENTS_PutRule_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.EVENTS_PutRule_H);
  });

  test('EVENTS_DeleteRule', async () => {
    const event = await sendMessage(DeleteEvents.EVENTS_DeleteRule);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:events:ap-northeast-1:999999999999:rule/ARMS_UnprocessedRule');
    const history = await getHistory({ EventId: DeleteEvents.EVENTS_DeleteRule.eventID });

    // fs.writeFileSync('./test/expect/events/EVENTS_DeleteRule_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.EVENTS_DeleteRule_H);
  });
});
