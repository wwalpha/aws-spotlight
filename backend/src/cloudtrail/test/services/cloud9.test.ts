import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as EXPECTS from '@test/expect/apigateway';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('cloud9.amazonaws.com', () => {
  test('CLOUD9_CreateEnvironmentEC2', async () => {
    const event = await sendMessage(CreateEvents.CLOUD9_CreateEnvironmentEC2);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:cloud9:ap-northeast-1:999999999999:environment:ishigaki-001');
    const history = await getHistory({ EventId: CreateEvents.CLOUD9_CreateEnvironmentEC2.eventID });

    fs.writeFileSync('./test/expect/cloud9/CLOUD9_CreateEnvironmentEC2_R.json', JSON.stringify(resource));
    fs.writeFileSync('./test/expect/cloud9/CLOUD9_CreateEnvironmentEC2_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.CLOUD9_CreateEnvironmentEC2_R);

    expect(history).not.toBeUndefined();
    // expect(history).toEqual(EXPECTS.CLOUD9_CreateEnvironmentEC2_H);
  });

  test.skip('APIGATEWAY_DeleteRestApi', async () => {
    const event = await sendMessage(DeleteEvents.APIGATEWAY_DeleteRestApi);

    await cloudtrail(event);

    const resource = await getResource('jrrfh5tt86');
    const history = await getHistory({ EventId: DeleteEvents.APIGATEWAY_DeleteRestApi.eventID });

    fs.writeFileSync('./test/expect/apigateway/APIGATEWAY_DeleteRestApi_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    // expect(history).toEqual(EXPECTS.APIGATEWAY_DeleteRestApi_H);
  });
});
