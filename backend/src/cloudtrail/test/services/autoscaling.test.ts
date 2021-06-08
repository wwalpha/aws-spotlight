import AWS from 'aws-sdk';
import { getHistory, getResource, sendMessage } from '@test/configs/utils';
import * as CreateEvents from '@test/datas/create';
import * as DeleteEvents from '@test/datas/delete';
import * as AUTOSCALING from '@test/expect/autoscaling';
import { cloudtrail } from '@src/index';

AWS.config.update({
  region: process.env.AWS_REGION,
  s3: { endpoint: process.env.AWS_ENDPOINT },
  sqs: { endpoint: process.env.AWS_ENDPOINT },
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

describe('autoscaling.amazonaws.com', () => {
  test('AUTOSCALING_CreateAutoScalingGroup', async () => {
    const event = await sendMessage(CreateEvents.AUTOSCALING_CreateAutoScalingGroup);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'autoscaling.amazonaws.com',
      ResourceId: 'ws-dev-autoscaling-1',
    });
    const history = await getHistory({ EventId: '75faba36-6137-4cfb-a189-9ebc46172d9b' });

    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(AUTOSCALING.CreateAutoScalingGroup_R);

    expect(history).not.toBeUndefined();
    expect(history).toEqual(AUTOSCALING.CreateAutoScalingGroup_H);
  });

  test('AUTOSCALING_DeleteAutoScalingGroup', async () => {
    const event = await sendMessage(DeleteEvents.AUTOSCALING_DeleteAutoScalingGroup);

    await cloudtrail(event);

    const resource = await getResource({
      EventSource: 'autoscaling.amazonaws.com',
      ResourceId: 'ws-dev-autoscaling-1',
    });
    const history = await getHistory({ EventId: '1bc25a53-cb48-49fb-8dda-b3d2ea472079' });

    expect(resource).toBeUndefined();
    expect(history).not.toBeUndefined();
    expect(history).toEqual(AUTOSCALING.DeleteAutoScalingGroup_H);
  });
});
