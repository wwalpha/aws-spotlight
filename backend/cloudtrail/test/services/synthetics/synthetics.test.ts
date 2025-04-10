import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('synthetics.amazonaws.com', () => {
  test('SYNTHETICS_CreateCanary', async () => {
    const event = await sendMessage(Events.SYNTHETICS_CreateCanary);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:synthetics:us-east-1:999999999999:canary:audit-region');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SYNTHETICS_CreateCanary);
  });

  test('SYNTHETICS_DeleteCanary', async () => {
    const event = await sendMessage(Events.SYNTHETICS_DeleteCanary);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:synthetics:us-east-1:999999999999:canary:audit-region');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SYNTHETICS_DeleteCanary);
  });
});
