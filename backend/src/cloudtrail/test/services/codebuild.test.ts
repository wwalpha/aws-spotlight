import AWS from 'aws-sdk';
import { getHistory, getResource, scanResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as CODEBUILD from '@test/expect/codebuild';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('codebuild.amazonaws.com', () => {
  test('CODEBUILD_CreateProject', async () => {
    const event = await sendMessage(CreateEvents.CODEBUILD_CreateProject);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:codebuild:ap-northeast-1:999999999999:project/test');
    const history = await getHistory({ EventId: '0ffc5c7d-b765-429c-b727-4ae0d737c544' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(CODEBUILD.CreateProject_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(CODEBUILD.CreateProject_H);
  });

  test('CODEBUILD_DeleteProject', async () => {
    const event = await sendMessage(DeleteEvents.CODEBUILD_DeleteProject);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:codebuild:ap-northeast-1:999999999999:project/test');
    const history = await getHistory({ EventId: '41804c2c-a898-42eb-ba29-21d55a05bf2f' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(CODEBUILD.DeleteProject_H);
  });
});
