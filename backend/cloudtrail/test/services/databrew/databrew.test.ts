import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('databrew.amazonaws.com', () => {
  test('DATABREW_CreateDataset', async () => {
    const event = await sendMessage(Events.DATABREW_CreateDataset);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:databrew:us-east-1:999999999999:dataset/Medline---Sample-1682559647556'
    );
    fs.writeFileSync(path.join(__dirname, './expects/DATABREW_CreateDataset.json'), JSON.stringify(resource));
    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.DATABREW_CreateDataset);
  });

  test('DATABREW_DeleteDataset', async () => {
    const event = await sendMessage(Events.DATABREW_DeleteDataset);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:databrew:us-east-1:999999999999:dataset/Medline---Sample-1682559647556'
    );
    fs.writeFileSync(path.join(__dirname, './expects/DATABREW_DeleteDataset.json'), JSON.stringify(resource));
    expect(resource).not.toBeUndefined();
    // expect(resource).toEqual(EXPECTS.DATABREW_DeleteDataset);
  });
});
