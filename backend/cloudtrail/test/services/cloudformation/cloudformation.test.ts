import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('cloudformation.amazonaws.com', () => {
  test('CLOUDFORMATION_CreateStack', async () => {
    const event = await sendMessage(Events.CLOUDFORMATION_CreateStack);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:cloudformation:ap-northeast-1:999999999999:stack/StackSet-AWS-QuickSetup-SSMHostMgmt-LA-qm255-1ba8b947-4616-48a1-9d95-535b245c559c'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CLOUDFORMATION_CreateStack);
  });

  test('CLOUDFORMATION_DeleteStack', async () => {
    const event = await sendMessage(Events.CLOUDFORMATION_DeleteStack);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:cloudformation:ap-northeast-1:999999999999:stack/StackSet-AWS-QuickSetup-SSMHostMgmt-LA-qm255-1ba8b947-4616-48a1-9d95-535b245c559c'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CLOUDFORMATION_DeleteStack);
  });
});
