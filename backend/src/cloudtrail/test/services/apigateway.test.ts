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
  test('CreateRestApi', async () => {
    const event = await sendMessage(CreateEvents.APIGATEWAY_CreateRestApi);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/apis/jrrfh5tt86');
    const history = await getHistory({ EventId: '90baa69e-caed-44bb-85fe-004348b07ea0' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(APIGATEWAY.CreateRestApi_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(APIGATEWAY.CreateRestApi_H);
  });

  test('ImportRestApi', async () => {
    const event = await sendMessage(CreateEvents.APIGATEWAY_ImportRestApi);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/apis/lyppg996u0');
    const history = await getHistory({ EventId: '86a4e780-56fc-422a-b95d-9f19ca5e2c11' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(APIGATEWAY.ImportRestApi_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(APIGATEWAY.ImportRestApi_H);
  });

  test('DeleteRestApi', async () => {
    const event = await sendMessage(DeleteEvents.APIGATEWAY_DeleteRestApi);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/apis/jrrfh5tt86');
    const history = await getHistory({ EventId: '86a4e780-56fc-422a-b95d-9f19ca5e2c11' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(APIGATEWAY.DeleteRestApi_H);
  });

  test('APIGATEWAY_CreateApi', async () => {
    const event = await sendMessage(CreateEvents.APIGATEWAY_CreateApi);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:us-east-1::/apis/aaaaaaaaa');
    const history = await getHistory({ EventId: 'ebf671db-0b6a-4936-999f-fa2a7516cdfd' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(APIGATEWAY.CreateApi_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(APIGATEWAY.CreateApi_H);
  });

  test('APIGATEWAY_CreateVpcLink', async () => {
    const event = await sendMessage(CreateEvents.APIGATEWAY_CreateVpcLink);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/vpclinks/j0owmk');
    const history = await getHistory({ EventId: 'fa4eb46f-041f-4b09-8b67-1ecd72362754' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(APIGATEWAY.CreateVpcLink_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(APIGATEWAY.CreateVpcLink_H);
  });

  test('APIGATEWAY_DeleteVpcLink', async () => {
    const event = await sendMessage(DeleteEvents.APIGATEWAY_DeleteVpcLink);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/vpclinks/j0owmk');
    const history = await getHistory({ EventId: '8edf5d7b-5c01-4fbd-b2e6-02e09fca35f6' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(APIGATEWAY.DeleteVpcLink_H);
  });
});
