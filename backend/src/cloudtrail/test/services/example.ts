import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import APIGATEWAY_CreateRestApi from '../datas/create/APIGATEWAY_CreateRestApi.json';
import APIGATEWAY_ImportRestApi from '../datas/create/APIGATEWAY_ImportRestApi.json';
import APIGATEWAY_DeleteRestApi from '../datas/delete/APIGATEWAY_DeleteRestApi.json';

import { cloudtrail } from '@src/index';
import {
  CreateRestApi_H,
  CreateRestApi_R,
  DeleteRestApi_H,
  ImportRestApi_H,
  ImportRestApi_R,
} from '@test/expect/apigateway';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('ec2.amazonaws.com', () => {
  test('CreateRestApi', async () => {
    const event = await sendMessage(APIGATEWAY_CreateRestApi);

    await cloudtrail(event);

    const resource = await getResource('jrrfh5tt86');
    const history = await getHistory({ EventId: '90baa69e-caed-44bb-85fe-004348b07ea0' });

    // fs.writeFileSync('CreateRestApi_R.json', JSON.stringify(resource));
    // fs.writeFileSync('CreateRestApi_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(CreateRestApi_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(CreateRestApi_H);
  });

  test('ImportRestApi', async () => {
    const event = await sendMessage(APIGATEWAY_ImportRestApi);

    await cloudtrail(event);

    const resource = await getResource('lyppg996u0');
    const history = await getHistory({ EventId: '86a4e780-56fc-422a-b95d-9f19ca5e2c11' });

    // fs.writeFileSync('ImportRestApi_R.json', JSON.stringify(resource));
    // fs.writeFileSync('ImportRestApi_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(ImportRestApi_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(ImportRestApi_H);
  });

  test('DeleteRestApi', async () => {
    const event = await sendMessage(APIGATEWAY_DeleteRestApi);

    await cloudtrail(event);

    const resource = await getResource('jrrfh5tt86');
    const history = await getHistory({ EventId: '86a4e780-56fc-422a-b95d-9f19ca5e2c11' });

    // fs.writeFileSync('DeleteRestApi_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(DeleteRestApi_H);
  });
});
