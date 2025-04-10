import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('states.amazonaws.com', () => {
  test('STATES_CreateStateMachine', async () => {
    const event = await sendMessage(Events.STATES_CreateStateMachine);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:states:ap-northeast-1:999999999999:stateMachine:BLyi9R1Js89B');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.STATES_CreateStateMachine);
  });

  test('STATES_DeleteStateMachine', async () => {
    const event = await sendMessage(Events.STATES_DeleteStateMachine);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:states:ap-northeast-1:999999999999:stateMachine:BLyi9R1Js89B');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.STATES_DeleteStateMachine);
  });
});
