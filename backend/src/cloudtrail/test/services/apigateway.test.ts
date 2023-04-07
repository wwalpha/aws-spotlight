import AWS from 'aws-sdk';
import { getHistory, getResource, scanResource, sendMessage } from '@test/configs/utils';
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

describe('EXPECTS.amazonaws.com', () => {
  test('CreateRestApi', async () => {
    const event = await sendMessage(CreateEvents.APIGATEWAY_CreateRestApi);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/apis/jrrfh5tt86');
    const history = await getHistory({ EventId: '90baa69e-caed-44bb-85fe-004348b07ea0' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CreateRestApi_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.CreateRestApi_H);
  });

  test('ImportRestApi', async () => {
    const event = await sendMessage(CreateEvents.APIGATEWAY_ImportRestApi);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/apis/lyppg996u0');
    const history = await getHistory({ EventId: '86a4e780-56fc-422a-b95d-9f19ca5e2c11' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ImportRestApi_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.ImportRestApi_H);
  });

  test('DeleteRestApi', async () => {
    const event = await sendMessage(DeleteEvents.APIGATEWAY_DeleteRestApi);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/apis/jrrfh5tt86');
    const history = await getHistory({ EventId: DeleteEvents.APIGATEWAY_DeleteRestApi.eventID });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.DeleteRestApi_H);
  });

  test('APIGATEWAY_CreateApi', async () => {
    const event = await sendMessage(CreateEvents.APIGATEWAY_CreateApi);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/apis/gk09okoppi');
    const history = await getHistory({ EventId: 'ebf671db-0b6a-4936-999f-fa2a7516cdfd' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CreateApi_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.CreateApi_H);
  });

  test('APIGATEWAY_DeleteApi', async () => {
    const event = await sendMessage(DeleteEvents.APIGATEWAY_DeleteApi);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/apis/gk09okoppi');
    const history = await getHistory({ EventId: 'fdff2ab8-d543-4835-a464-b84c0c2257e0' });

    // fs.writeFileSync('./test/expect/apigateway/APIGATEWAY_DeleteApi_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.APIGATEWAY_DeleteApi_H);
  });

  test('APIGATEWAY_CreateVpcLink', async () => {
    const event = await sendMessage(CreateEvents.APIGATEWAY_CreateVpcLink);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/vpclinks/j0owmk');
    const history = await getHistory({ EventId: 'fa4eb46f-041f-4b09-8b67-1ecd72362754' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CreateVpcLink_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.CreateVpcLink_H);
  });

  test('APIGATEWAY_DeleteVpcLink', async () => {
    const event = await sendMessage(DeleteEvents.APIGATEWAY_DeleteVpcLink);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/vpclinks/j0owmk');
    const history = await getHistory({ EventId: '8edf5d7b-5c01-4fbd-b2e6-02e09fca35f6' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.DeleteVpcLink_H);
  });

  test('APIGATEWAY_CreateDomainName', async () => {
    const event = await sendMessage(CreateEvents.APIGATEWAY_CreateDomainName);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/domainnames/api.arms.onecloudlabo.com');
    const history = await getHistory({ EventId: CreateEvents.APIGATEWAY_CreateDomainName.eventID });

    // fs.writeFileSync('./test/expect/apigateway/APIGATEWAY_CreateDomainName_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/apigateway/APIGATEWAY_CreateDomainName_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.APIGATEWAY_CreateDomainName_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.APIGATEWAY_CreateDomainName_H);
  });

  test('APIGATEWAY_DeleteDomainName', async () => {
    const event = await sendMessage(DeleteEvents.APIGATEWAY_DeleteDomainName);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:apigateway:ap-northeast-1::/domainnames/api.arms.onecloudlabo.com');
    const history = await getHistory({ EventId: DeleteEvents.APIGATEWAY_DeleteDomainName.eventID });

    // fs.writeFileSync('./test/expect/apigateway/APIGATEWAY_DeleteDomainName_H.json', JSON.stringify(history));

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.APIGATEWAY_DeleteDomainName_H);
  });
});
