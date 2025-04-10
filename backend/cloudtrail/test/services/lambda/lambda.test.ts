import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('lambda.amazonaws.com', () => {
  test('LAMBDA_CreateFunction20150331', async () => {
    const event = await sendMessage(Events.LAMBDA_CreateFunction20150331);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:lambda:ap-northeast-1:999999999999:function:RekogDemoSetupEngagementMeter'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.LAMBDA_CreateFunction20150331);
  });

  test('LAMBDA_DeleteFunction20150331', async () => {
    const event = await sendMessage(Events.LAMBDA_DeleteFunction20150331);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:lambda:ap-northeast-1:999999999999:function:RekogDemoSetupEngagementMeter'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.LAMBDA_DeleteFunction20150331);
  });
});
