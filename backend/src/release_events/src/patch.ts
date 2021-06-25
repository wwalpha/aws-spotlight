import { DynamodbHelper } from '@alphax/dynamodb';
import { Tables } from 'typings';

const helper = new DynamodbHelper();
const TABLE_NAME_RESOURCE = process.env.TABLE_NAME_RESOURCE as string;

const start = async () => {
  const s3Items = await helper.query<Tables.Resource>({
    TableName: TABLE_NAME_RESOURCE,
    KeyConditionExpression: 'EventSource = :EventSource',
    ExpressionAttributeValues: {
      ':EventSource': 's3.amazonaws.com',
    },
  });

  const newS3Items = s3Items.Items.map((item) => ({ ...item, Service: 'Bucket' }));

  await helper.bulk(TABLE_NAME_RESOURCE, newS3Items);

  const iamItems = await helper.query<Tables.Resource>({
    TableName: TABLE_NAME_RESOURCE,
    KeyConditionExpression: 'EventSource = :EventSource',
    ExpressionAttributeValues: {
      ':EventSource': 'iam.amazonaws.com',
    },
  });

  const newIAMItems = iamItems.Items.map((item) => {
    let service: string = '';

    if (item.EventName === 'CreateAccessKey') {
      service = 'AccessKey';
    }
    if (item.EventName === 'CreateRole') {
      service = 'Role';
    }

    return { ...item, Service: service };
  });

  await helper.bulk(TABLE_NAME_RESOURCE, newIAMItems);
};

start();
