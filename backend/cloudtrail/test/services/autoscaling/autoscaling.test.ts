import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('autoscaling.amazonaws.com', () => {
  test('AUTOSCALING_CreateAutoScalingGroup', async () => {
    const event = await sendMessage(Events.AUTOSCALING_CreateAutoScalingGroup);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:autoscaling:ap-northeast-1:999999999999:autoScalingGroup:*:autoScalingGroupName/ws-dev-autoscaling-1'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.AUTOSCALING_CreateAutoScalingGroup);
  });

  test('AUTOSCALING_DeleteAutoScalingGroup', async () => {
    const event = await sendMessage(Events.AUTOSCALING_DeleteAutoScalingGroup);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:autoscaling:ap-northeast-1:999999999999:autoScalingGroup:*:autoScalingGroupName/ws-dev-autoscaling-1'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.AUTOSCALING_DeleteAutoScalingGroup);
  });
});
