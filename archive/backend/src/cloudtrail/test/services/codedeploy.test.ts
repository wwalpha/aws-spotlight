import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail } from '@src/index';
import * as EXPECTS from '@test/expect/coddeploy';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('codedeploy.amazonaws.com', () => {
  test('CODEDEPLOY_CreateApplication', async () => {
    const event = await sendMessage(CreateEvents.CODEDEPLOY_CreateApplication);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:codedeploy:ap-northeast-1:999999999999:application/Nodejs');
    const history = await getHistory({ EventId: CreateEvents.CODEDEPLOY_CreateApplication.eventID });

    // fs.writeFileSync('CODEDEPLOY_CreateApplication_R.json', JSON.stringify(resource));
    // fs.writeFileSync('CODEDEPLOY_CreateApplication_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CODEDEPLOY_CreateApplication_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.CODEDEPLOY_CreateApplication_H);
  });

  test('CODEDEPLOY_DeleteApplication', async () => {
    const event = await sendMessage(DeleteEvents.CODEDEPLOY_DeleteApplication);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:codedeploy:ap-northeast-1:999999999999:application/Nodejs');
    const history = await getHistory({ EventId: DeleteEvents.CODEDEPLOY_DeleteApplication.eventID });

    // fs.writeFileSync('CODEDEPLOY_DeleteApplication_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.CODEDEPLOY_DeleteApplication_H);
  });
});
