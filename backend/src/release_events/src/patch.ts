import { DynamodbHelper } from '@alphax/dynamodb';
import { Environments } from './consts';

const start = async () => {
  const helper = new DynamodbHelper();

  await helper.put({
    TableName: Environments.TABLE_NAME_SETTINGS,
    Item: {
      Id: 'GLOBAL_SERVICES',
      Services: ['iam.amazonaws.com'],
    },
  });

  await helper.put({
    TableName: Environments.TABLE_NAME_SETTINGS,
    Item: {
      Id: 'API_KEY',
      Keys: ['9999999999'],
    },
  });
};

start();
