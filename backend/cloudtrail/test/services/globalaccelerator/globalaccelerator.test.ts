import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('globalaccelerator.amazonaws.com', () => {
  test('GLOBALACCELERATOR_CreateAccelerator', async () => {
    const event = await sendMessage(Events.GLOBALACCELERATOR_CreateAccelerator);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:globalaccelerator::999999999999:accelerator/3bcfb219-ffc0-46c8-801d-91510c236d87'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.GLOBALACCELERATOR_CreateAccelerator);
  });

  test('GLOBALACCELERATOR_DeleteAccelerator', async () => {
    const event = await sendMessage(Events.GLOBALACCELERATOR_DeleteAccelerator);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:globalaccelerator::999999999999:accelerator/3bcfb219-ffc0-46c8-801d-91510c236d87'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.GLOBALACCELERATOR_DeleteAccelerator);
  });
});
