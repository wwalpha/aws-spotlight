import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as APIGATEWAY from '@test/expect/apigateway';
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

    const resource = await getResource('jrrfh5tt86');
    const history = await getHistory({ EventId: '90baa69e-caed-44bb-85fe-004348b07ea0' });

    fs.writeFileSync('CreateRestApi_R.json', JSON.stringify(resource));
    fs.writeFileSync('CreateRestApi_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(APIGATEWAY.CreateRestApi_R);

    expect(history).not.toBeUndefined();
    // expect(history).toEqual(APIGATEWAY.CreateRestApi_H);
  });

  test('APIGATEWAY_DeleteRestApi', async () => {
    const event = await sendMessage(DeleteEvents.APIGATEWAY_DeleteRestApi);

    await cloudtrail(event);

    const resource = await getResource('jrrfh5tt86');
    const history = await getHistory({ EventId: '86a4e780-56fc-422a-b95d-9f19ca5e2c11' });

    fs.writeFileSync('DeleteRestApi_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    // expect(history).toEqual(APIGATEWAY.DeleteRestApi_H);
  });
});
