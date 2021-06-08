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

    const resource = await getResource({
      EventSource: 'iam.amazonaws.com',
      ResourceId: 'AAAAAAAAAAAAAAAAAAAA',
    });
    const history = await getHistory({ EventId: '173aca94-54f1-4a01-9ec2-7b471c918eaf' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(IAM.CreateAccessKey_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(IAM.CreateAccessKey_H);
  });

  test('IAM_DeleteAccessKey', async () => {
    const event = await sendMessage(DeleteEvents.IAM_DeleteAccessKey);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'iam.amazonaws.com',
      ResourceId: 'AAAAAAAAAAAAAAAAAAAA',
    });
    const history = await getHistory({ EventId: '410af4e7-868f-4c9d-b02e-41c779011f0e' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(IAM.DeleteAccessKey_H);
  });
});
