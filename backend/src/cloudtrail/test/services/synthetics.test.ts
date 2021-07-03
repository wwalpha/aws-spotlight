import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as SYNTHETICS from '@test/expect/synthetics';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('synthetics.amazonaws.com', () => {
  test('SYNTHETICS_CreateCanary', async () => {
    const event = await sendMessage(CreateEvents.SYNTHETICS_CreateCanary);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:synthetics:us-east-1:999999999999:canary:audit-region');
    const history = await getHistory({ EventId: '633c390c-0e23-47ec-ba16-eea684ad24c3' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(SYNTHETICS.CreateCanary_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(SYNTHETICS.CreateCanary_H);
  });

  test('SYNTHETICS_DeleteCanary', async () => {
    const event = await sendMessage(DeleteEvents.SYNTHETICS_DeleteCanary);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:synthetics:us-east-1:999999999999:canary:audit-region');
    const history = await getHistory({ EventId: '166ef8a9-da17-4390-be3e-5fe4bd9b29b6' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(SYNTHETICS.DeleteCanary_H);
  });
});
