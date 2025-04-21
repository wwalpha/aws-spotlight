import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('amplify.amazonaws.com', () => {
  test('AMPLIFY_CreateApp', async () => {
    const event = await sendMessage(Events.AMPLIFY_CreateApp);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:amplify:ap-northeast-1:334678299258:apps/d3dvp6yb0v6as5');
    // fs.writeFileSync(path.join(__dirname, './expects/AMPLIFY_CreateApp.json'), JSON.stringify(resource));
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.AMPLIFY_CreateApp);
  });

  test('AMPLIFY_DeleteApp', async () => {
    const event = await sendMessage(Events.AMPLIFY_DeleteApp);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:amplify:ap-northeast-1:334678299258:apps/d3dvp6yb0v6as5');
    // fs.writeFileSync(path.join(__dirname, './expects/AMPLIFY_DeleteApp.json'), JSON.stringify(resource));
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.AMPLIFY_DeleteApp);
  });
});
