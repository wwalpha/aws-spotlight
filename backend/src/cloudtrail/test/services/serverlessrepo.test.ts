import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as EXPECTS from '@test/expect/serverlessrepo';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('serverlessrepo.amazonaws.com', () => {
  test('SERVERLESSREPO_CreateApplication', async () => {
    const event = await sendMessage(CreateEvents.SERVERLESSREPO_CreateApplication);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:serverlessrepo:ap-northeast-1:999999999999:applications/AutoStopOntime'
    );
    const history = await getHistory({ EventId: CreateEvents.SERVERLESSREPO_CreateApplication.eventID });

    // fs.writeFileSync('./test/expect/serverlessrepo/SERVERLESSREPO_CreateApplication_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/serverlessrepo/SERVERLESSREPO_CreateApplication_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SERVERLESSREPO_CreateApplication_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.SERVERLESSREPO_CreateApplication_H);
  });

  test.skip('SERVERLESSREPO_DeleteApplication', async () => {
    const event = await sendMessage(DeleteEvents.APIGATEWAY_DeleteRestApi);

    await cloudtrail(event);

    const resource = await getResource('jrrfh5tt86');
    const history = await getHistory({ EventId: DeleteEvents.APIGATEWAY_DeleteRestApi.eventID });

    fs.writeFileSync('./test/expect/serverlessrepo/APIGATEWAY_DeleteRestApi_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    // expect(history).toEqual(EXPECTS.APIGATEWAY_DeleteRestApi_H);
  });
});
