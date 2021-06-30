import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as IAM from '@test/expect/iam';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('iam.amazonaws.com', () => {
  test('IAM_CreateAccessKey', async () => {
    const event = await sendMessage(CreateEvents.IAM_CreateAccessKey);

    await cloudtrail(event);

    const resource = await getResource('AAAAAAAAAAAAAAAAAAAA');
    const history = await getHistory({ EventId: '173aca94-54f1-4a01-9ec2-7b471c918eaf' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(IAM.CreateAccessKey_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(IAM.CreateAccessKey_H);
  });

  test('IAM_DeleteAccessKey', async () => {
    const event = await sendMessage(DeleteEvents.IAM_DeleteAccessKey);

    await cloudtrail(event);

    const resource = await getResource('AAAAAAAAAAAAAAAAAAAA');
    const history = await getHistory({ EventId: '410af4e7-868f-4c9d-b02e-41c779011f0e' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(IAM.DeleteAccessKey_H);
  });

  test('IAM_CreateRole', async () => {
    const event = await sendMessage(CreateEvents.IAM_CreateRole);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:iam::999999999999:role/rds-monitoring-role');
    const history = await getHistory({ EventId: '739d8b02-6cf3-44a6-84d6-2cb3fccd16a7' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(IAM.CreateRole_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(IAM.CreateRole_H);
  });

  test('IAM_DeleteRole', async () => {
    const event = await sendMessage(DeleteEvents.IAM_DeleteRole);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:iam::999999999999:role/rds-monitoring-role');
    const history = await getHistory({ EventId: '2a6c2b17-635c-463b-80ce-3d3da6cf98c0' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(IAM.DeleteRole_H);
  });
});
