import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as EXPECTS from '@test/expect/logs';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('logs.amazonaws.com', () => {
  test('LOGS_CreateLogGroup', async () => {
    const event = await sendMessage(CreateEvents.LOGS_CreateLogGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:logs:ap-northeast-1:999999999999:log-group:/ecs/nodejs-bluegreen');
    const history = await getHistory({ EventId: CreateEvents.LOGS_CreateLogGroup.eventID });

    // fs.writeFileSync('LOGS_CreateLogGroup_R.json', JSON.stringify(resource));
    // fs.writeFileSync('LOGS_CreateLogGroup_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.LOGS_CreateLogGroup_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.LOGS_CreateLogGroup_H);
  });

  test('LOGS_DeleteLogGroup', async () => {
    const event = await sendMessage(DeleteEvents.LOGS_DeleteLogGroup);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:logs:ap-northeast-1:999999999999:log-group:/ecs/nodejs-bluegreen');
    const history = await getHistory({ EventId: DeleteEvents.LOGS_DeleteLogGroup.eventID });

    // fs.writeFileSync('LOGS_DeleteLogGroup_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.LOGS_DeleteLogGroup_H);
  });
});
