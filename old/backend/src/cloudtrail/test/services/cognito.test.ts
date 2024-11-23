import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as EXPECTS from '@test/expect/cognito';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('cognito.amazonaws.com', () => {
  test('COGNITOIDP_CreateUserPool', async () => {
    const event = await sendMessage(CreateEvents.COGNITOIDP_CreateUserPool);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:cognito-idp:ap-northeast-1:999999999999:userpool/ap-northeast-1_wy66UkJFG'
    );
    const history = await getHistory({ EventId: CreateEvents.COGNITOIDP_CreateUserPool.eventID });

    // fs.writeFileSync('./test/expect/cognito/COGNITOIDP_CreateUserPool_R.json', JSON.stringify(resource));
    // fs.writeFileSync('./test/expect/cognito/COGNITOIDP_CreateUserPool_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.COGNITOIDP_CreateUserPool_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.COGNITOIDP_CreateUserPool_H);
  });

  test.skip('COGNITOIDP_DeleteUserPool', async () => {
    const event = await sendMessage(DeleteEvents.APIGATEWAY_DeleteRestApi);

    await cloudtrail(event);

    const resource = await getResource('jrrfh5tt86');
    const history = await getHistory({ EventId: DeleteEvents.APIGATEWAY_DeleteRestApi.eventID });

    fs.writeFileSync('./test/expect/apigateway/APIGATEWAY_DeleteRestApi_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    // expect(history).toEqual(EXPECTS.APIGATEWAY_DeleteRestApi_H);
  });

  test('COGNITOIDENTITY_CreateIdentityPool', async () => {
    const event = await sendMessage(CreateEvents.COGNITOIDENTITY_CreateIdentityPool);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:cognito-identity:ap-northeast-1:999999999999:identitypool/ap-northeast-1:904e93af-2e9c-4ce9-872b-72566f046d1d'
    );
    const history = await getHistory({ EventId: CreateEvents.COGNITOIDENTITY_CreateIdentityPool.eventID });

    fs.writeFileSync('./test/expect/cognito/COGNITOIDENTITY_CreateIdentityPool_R.json', JSON.stringify(resource));
    fs.writeFileSync('./test/expect/cognito/COGNITOIDENTITY_CreateIdentityPool_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.COGNITOIDENTITY_CreateIdentityPool_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(EXPECTS.COGNITOIDENTITY_CreateIdentityPool_H);
  });

  test.skip('COGNITOIDENTITY_DeleteIdentityPool', async () => {
    const event = await sendMessage(DeleteEvents.APIGATEWAY_DeleteRestApi);

    await cloudtrail(event);

    const resource = await getResource('jrrfh5tt86');
    const history = await getHistory({ EventId: DeleteEvents.APIGATEWAY_DeleteRestApi.eventID });

    fs.writeFileSync('./test/expect/apigateway/APIGATEWAY_DeleteRestApi_H.json', JSON.stringify(history));

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    // expect(history).toEqual(EXPECTS.APIGATEWAY_DeleteRestApi_H);
  });
});
