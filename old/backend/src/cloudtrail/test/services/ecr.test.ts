import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as ECR from '@test/expect/ecr';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('ecr.amazonaws.com', () => {
  test('ECR_CreateRepository', async () => {
    const event = await sendMessage(CreateEvents.ECR_CreateRepository);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ecr:ap-northeast-1:999999999999:repository/nodejs-blue');
    const history = await getHistory({ EventId: '0b72cf23-70be-4837-9c1e-2b624723d2c8' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(ECR.CreateRepository_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(ECR.CreateRepository_H);
  });

  test('ECR_DeleteRepository', async () => {
    const event = await sendMessage(DeleteEvents.ECR_DeleteRepository);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:ecr:ap-northeast-1:999999999999:repository/nodejs-blue');
    const history = await getHistory({ EventId: '9c1e1eb1-1668-4420-bd24-bf38a3aa96ce' });

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(ECR.DeleteRepository_H);
  });
});
