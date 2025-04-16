import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe.skip('globalaccelerator.amazonaws.com', () => {
  test('GLOBALACCELERATOR_CreateAccelerator', async () => {
    const event = await sendMessage(Events.GLOBALACCELERATOR_CreateAccelerator);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:route53resolver:ap-northeast-1:999999999999:resolver-endpoint/rslvr-in-9747e1a641b34ad39'
    );
    fs.writeFileSync(
      path.join(__dirname, './expects/GLOBALACCELERATOR_CreateAccelerator.json'),
      JSON.stringify(resource)
    );
    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.GLOBALACCELERATOR_CreateAccelerator);
  });

  test('GLOBALACCELERATOR_DeleteAccelerator', async () => {
    const event = await sendMessage(Events.GLOBALACCELERATOR_DeleteAccelerator);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:route53resolver:ap-northeast-1:999999999999:resolver-endpoint/rslvr-in-9747e1a641b34ad39'
    );
    fs.writeFileSync(
      path.join(__dirname, './expects/GLOBALACCELERATOR_DeleteAccelerator.json'),
      JSON.stringify(resource)
    );
    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.GLOBALACCELERATOR_DeleteAccelerator);
  });
});
