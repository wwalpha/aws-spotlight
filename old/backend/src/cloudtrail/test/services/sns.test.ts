import AWS from 'aws-sdk';
import { getHistory, getResource, scanResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as EXPECTS from '@test/expect/sns';
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
    const history = await getHistory({ EventId: CreateEvents.SNS_CreateTopic.eventID });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CreateTopic_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.CreateTopic_H);
  });

  test('SNS_DeleteTopic', async () => {
    const event = await sendMessage(DeleteEvents.SNS_DeleteTopic);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:sns:us-east-1:999999999999:arms-admin');
    const history = await getHistory({ EventId: DeleteEvents.SNS_DeleteTopic.eventID });

    // fs.writeFileSync('./test/expect/sns/SNS_DeleteTopic_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.SNS_DeleteTopic_H);
  });
});
