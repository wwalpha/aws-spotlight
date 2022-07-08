import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as CONNECT from '@test/expect/connect';
import { cloudtrail } from '@src/index';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('connect.amazonaws.com', () => {
  test('CONNECT_CreateInstance', async () => {
    const event = await sendMessage(CreateEvents.CONNECT_CreateInstance);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:connect:ap-northeast-1:999999999999:instance/14c561e5-5dbf-4048-8c16-779db493a66a'
    );
    const history = await getHistory({ EventId: '2ebc40b4-4e53-4e87-ac9a-0a8bc090a438' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(CONNECT.CreateInstance_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(CONNECT.CreateInstance_H);
  });

  test('CONNECT_DeleteInstance', async () => {
    const event = await sendMessage(DeleteEvents.CONNECT_DeleteInstance);

    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:connect:ap-northeast-1:999999999999:instance/14c561e5-5dbf-4048-8c16-779db493a66a'
    );
    const history = await getHistory({ EventId: '0f3f66dc-d704-4bd4-b37a-06ecee7b9f6a' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(CONNECT.DeleteInstance_H);
  });
});
