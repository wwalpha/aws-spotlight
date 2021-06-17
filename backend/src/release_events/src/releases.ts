import { DynamodbHelper } from '@alphax/dynamodb';
import { Environments, SETTINGS_ID_RELEASE } from './consts';
import { Tables } from 'typings';
import Releases from '../datas/releases.json';

const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

export const start = async () => {
  // update release notes
  await helper.put({
    TableName: Environments.TABLE_NAME_SETTINGS,
    Item: {
      Id: SETTINGS_ID_RELEASE,
      Texts: Releases as any,
    } as Tables.Settings.Releases,
  });
};

start();
