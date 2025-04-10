import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';

describe('sagemaker.amazonaws.com', () => {
  test('SAGEMAKER_CreateDomain', async () => {
    const event = await sendMessage(Events.SAGEMAKER_CreateDomain);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:sagemaker:us-east-1:999999999999:domain/d-dml2esvpdmj6');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SAGEMAKER_CreateDomain);
  });

  test('SAGEMAKER_DeleteDomain', async () => {
    const event = await sendMessage(Events.SAGEMAKER_DeleteDomain);

    await cloudtrail(event);

    const resource = await getResource('arn:aws:sagemaker:us-east-1:999999999999:domain/d-dml2esvpdmj6');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.SAGEMAKER_DeleteDomain);
  });
});
