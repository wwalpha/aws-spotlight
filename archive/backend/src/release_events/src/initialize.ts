import { DynamodbHelper } from '@alphax/dynamodb';
import { Environments } from './consts';
import Initialize from '../datas/initialize.json';

const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

export const start = async () => {
  // update release notes
  await helper.bulk(Environments.TABLE_NAME_SETTINGS, Initialize);
};

start();
