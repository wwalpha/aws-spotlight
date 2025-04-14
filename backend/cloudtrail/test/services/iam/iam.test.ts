import { getResource, sendMessage } from '@test/utils/utils';
import { cloudtrail } from '@src/index';
import * as Events from './datas';
import * as EXPECTS from './expects';
import * as fs from 'fs';
import * as path from 'path';

describe('iam.amazonaws.com', () => {
  test('IAM_CreateUser', async () => {
    const event = await sendMessage(Events.IAM_CreateUser);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:iam::999999999999:user/test-user');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.IAM_CreateUser);
  });

  test('IAM_DeleteUser', async () => {
    const event = await sendMessage(Events.IAM_DeleteUser);
    await cloudtrail(event);

    const resource = await getResource('arn:aws:iam::999999999999:user/test-user');
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.IAM_DeleteUser);
  });

  test('IAM_CreateServiceLinkedRole', async () => {
    const event = await sendMessage(Events.IAM_CreateServiceLinkedRole);
    await cloudtrail(event);

    const resource = await getResource(
      'arn:aws:iam::999999999999:role/aws-service-role/fis.amazonaws.com/AWSServiceRoleForFIS'
    );
    expect(resource).not.toBeUndefined();
    expect(resource).toEqual(EXPECTS.IAM_CreateServiceLinkedRole);
  });
});
