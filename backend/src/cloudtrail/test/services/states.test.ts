import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import { cloudtrail } from '@src/index';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as STATES from '@test/expect/states';
import * as fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('states.amazonaws.com', () => {
  test('STATES_CreateStateMachine', async () => {
    const event = await sendMessage(CreateEvents.STATES_CreateStateMachine);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:states:ap-northeast-1:999999999999:stateMachine:BLyi9R1Js89B');
    const history = await getHistory({ EventId: '8d4c6abd-1ff2-4f34-a624-93b8a38500c7' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(STATES.CreateStateMachine_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(STATES.CreateStateMachine_H);
  });

  test('STATES_DeleteStateMachine', async () => {
    const event = await sendMessage(DeleteEvents.STATES_DeleteStateMachine);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:states:ap-northeast-1:999999999999:stateMachine:BLyi9R1Js89B');
    const history = await getHistory({ EventId: '4ff266d5-4d9b-4c16-ad94-b8935b2f5f04' });

    expect(resource).toBeUndefined();

    expect(history).not.toBeUndefined();
    expect(history).toEqual(STATES.DeleteStateMachine_H);
  });
});
