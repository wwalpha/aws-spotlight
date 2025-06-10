import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as BATCH from '@test/expect/batch';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('batch.amazonaws.com', () => {
  test('BATCH_CreateComputeEnvironment', async () => {
    const event = await sendMessage(CreateEvents.BATCH_CreateComputeEnvironment);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:batch:ap-northeast-1:999999999999:compute-environment/first-run-compute-environment'
    );
    const history = await getHistory({ EventId: 'b7339f01-c320-45dd-b566-abbc08c054a8' });

    fs.writeFileSync('./test/expect/batch/BATCH_CreateComputeEnvironment_R.json', JSON.stringify(resource));

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(BATCH.CreateComputeEnvironment_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(BATCH.CreateComputeEnvironment_H);
  });

  test('BATCH_DeleteComputeEnvironment', async () => {
    const event = await sendMessage(DeleteEvents.BATCH_DeleteComputeEnvironment);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:batch:ap-northeast-1:999999999999:compute-environment/first-run-compute-environment'
    );
    const history = await getHistory({ EventId: 'be9e02c9-ea31-4616-aabb-c544e8024711' });

    fs.writeFileSync('./test/expect/batch/BATCH_DeleteComputeEnvironment_R.json', JSON.stringify(resource));

    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(BATCH.BATCH_DeleteComputeEnvironment_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(BATCH.DeleteComputeEnvironment_H);
  });
});
