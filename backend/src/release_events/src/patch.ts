import { DynamodbHelper } from '@alphax/dynamodb';
import { Tables } from 'typings';

const start = async () => {
  // const helper = new DynamodbHelper();
  // const itemEC2 = await helper.query<Tables.Resource>({
  //   TableName: process.env.TABLE_NAME_RESOURCES as string,
  //   IndexName: 'gsiIdx1',
  //   KeyConditionExpression: '#EventSource = :EventSource',
  //   ExpressionAttributeNames: {
  //     '#EventSource': 'EventSource',
  //   },
  //   ExpressionAttributeValues: {
  //     ':EventSource': 'ec2.amazonaws.com',
  //   },
  // });
  // for (; itemEC2.Items.length > 0; ) {
  //   const item = itemEC2.Items.pop();
  //   if (!item) continue;
  //   if (item.Service !== 'Instance') continue;
  //   await EC2_Instance(item);
  // }
};

start();
