import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage, scanResource } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import { cloudtrail } from '@src/index';
import * as Lambda from '@test/expect/lambda';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('lambda.amazonaws.com', () => {
  test('LAMBDA_CreateFunction20150331', async () => {
    const event = await sendMessage(CreateEvents.LAMBDA_CreateFunction20150331);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:lambda:ap-northeast-1:999999999999:function:RekogDemoSetupEngagementMeter'
    );
    const history = await getHistory({ EventId: 'e9f2276f-0e07-42ed-b1a9-1758916a2d7d' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(Lambda.CreateFunction20150331_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(Lambda.CreateFunction20150331_H);
  });

  test('LAMBDA_DeleteFunction20150331', async () => {
    const event = await sendMessage(DeleteEvents.LAMBDA_DeleteFunction20150331);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:lambda:ap-northeast-1:999999999999:function:RekogDemoSetupEngagementMeter'
    );
    const history = await getHistory({ EventId: '78358ae7-e395-4813-a659-1cd40248272b' });

    expect(resource).not.toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(Lambda.DeleteFunction20150331_H);
  });
});
