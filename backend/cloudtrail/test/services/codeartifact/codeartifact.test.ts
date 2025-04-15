import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('codeartifact.amazonaws.com', () => {
  test('CODEARTIFACT_CreateRepository', async () => {
    const event = await sendMessage(Events.CODEARTIFACT_CreateRepository);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:codeartifact:ap-northeast-1:999999999999:repository/dxc-poc-cameldemo-jamin/maven-central-store'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CODEARTIFACT_CreateRepository);
  });

  test('CODEARTIFACT_DeleteRepository', async () => {
    const event = await sendMessage(Events.CODEARTIFACT_DeleteRepository);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:codeartifact:ap-northeast-1:999999999999:repository/dxc-poc-cameldemo-jamin/maven-central-store'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.CODEARTIFACT_DeleteRepository);
  });
});
