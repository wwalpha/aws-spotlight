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

describe('apigateway.amazonaws.com', () => {
  test('APIGATEWAY_CreateRestApi', async () => {
    const event = await sendMessage(CreateEvents.APIGATEWAY_CreateRestApi);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ec2:ap-northeast-1:999999999999:instance/i-0fc5d99558e8357e8');
    const history = await getHistory({ EventId: CreateEvents.APIGATEWAY_CreateRestApi.eventID });

    fs.writeFileSync('./test/expect/apigateway/CreateRestApi_R.json', JSON.stringify(resource));
    fs.writeFileSync('./test/expect/apigateway/CreateRestApi_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.CreateRestApi_R);

    expect(history).not.toBeUndefined();
    // expect(history).toEqual(EXPECTS.CreateRestApi_H);
  });

  test('APIGATEWAY_DeleteRestApi', async () => {
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
