import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail } from '@src/index';
import * as EXPECTS from '@test/expect/iot';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('iot.amazonaws.com', () => {
  test('IOT_CreateTopicRule', async () => {
    const event = await sendMessage(CreateEvents.IOT_CreateTopicRule);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:iot:ap-northeast-1:999999999999:rule/darRule');
    const history = await getHistory({ EventId: CreateEvents.IOT_CreateTopicRule.eventID });

    // fs.writeFileSync('IOT_CreateTopicRule_R.json', JSON.stringify(resource));
    // fs.writeFileSync('IOT_CreateTopicRule_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.IOT_CreateTopicRule_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.IOT_CreateTopicRule_H);
  });

  test('IOT_DeleteTopicRule', async () => {
    const event = await sendMessage(DeleteEvents.IOT_DeleteTopicRule);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:iot:ap-northeast-1:999999999999:rule/darRule');
    const history = await getHistory({ EventId: DeleteEvents.IOT_DeleteTopicRule.eventID });

    // fs.writeFileSync('IOT_DeleteTopicRule_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.IOT_DeleteTopicRule_H);
  });
});
