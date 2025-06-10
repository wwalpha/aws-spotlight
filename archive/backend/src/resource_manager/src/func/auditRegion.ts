import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { orderBy } from 'lodash';
import { Environments } from '../consts';
import { DynamodbHelper } from '../utils';
import { Tables } from 'typings';

const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
});

export const auditRegion = async (): Promise<void> => {
  const settings = await DynamodbHelper.get<Tables.Settings.GlobalServices>({
    TableName: Environments.TABLE_NAME_SETTINGS,
    Key: {
      Id: 'GLOBAL_SERVICES',
    } as Tables.Settings.Key,
  });

  const services = settings?.Item?.Services;

  const result = await DynamodbHelper.scan<Tables.TResource>({
    TableName: Environments.TABLE_NAME_RESOURCES,
    FilterExpression: 'AWSRegion <> :AWSRegion',
    ExpressionAttributeValues: {
      ':AWSRegion': 'ap-northeast-1',
    },
  });

  const targets = result.Items.filter((item) => {
    if (!services) return true;

    // exclude global services
    return !services.includes(item.EventSource);
  })
    // exclude arms system resource
    .filter((item) => item.ResourceId.toUpperCase().indexOf('ARMS') === -1)
    // include dxc user
    .filter((item) => item.UserName.endsWith('dxc.com'));

  // no targets
  if (targets.length === 0) {
    return;
  }

  // sort by username
  const sorted = orderBy(targets, ['UserName', 'ResourceId'], ['asc', 'asc']);

  // create message body
  const messages = sorted.map((item) => {
    return `<strong>UserName:</strong> ${item.UserName}  <strong>ARN:</strong> ${item.ResourceId}`;
  });

  // send to admin
  await snsClient.send(
    new PublishCommand({
      TopicArn: Environments.SNS_TOPIC_ARN_ADMIN,
      Subject: 'Outscope region resources',
      Message: messages.join('\n'),
    })
  );
};
