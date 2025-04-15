import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('elasticbeanstalk.amazonaws.com', () => {
  test('ELASTICBEANSTALK_CreateApplication', async () => {
    const event = await sendMessage(Events.ELASTICBEANSTALK_CreateApplication);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:elasticbeanstalk:ap-northeast-1:999999999999:application/talend-join-table'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ELASTICBEANSTALK_CreateApplication);
  });

  test('ELASTICBEANSTALK_DeleteApplication', async () => {
    const event = await sendMessage(Events.ELASTICBEANSTALK_DeleteApplication);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:elasticbeanstalk:ap-northeast-1:999999999999:application/talend-join-table'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.ELASTICBEANSTALK_DeleteApplication);
  });
});
