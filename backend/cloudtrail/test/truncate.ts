import { DynamodbHelper } from '@alphax/dynamodb';
import { ResourceService } from '@src/services';

const TABLE_NAME_RESOURCES = process.env.TABLE_NAME_RESOURCES as string;

const start = async () => {
  const helper = new DynamodbHelper();
  await helper.truncateAll(TABLE_NAME_RESOURCES);

  await ResourceService.regist({
    ResourceId: 'arn:aws:iam::999999999999:role/EC2Role',
    AWSRegion: 'us-east-1',
    EventId: '99999999-6d19-4696-95f8-97e27ff57bad',
    EventName: 'CreateRole',
    EventSource: 'iam.amazonaws.com',
    EventTime: '2020-10-12T05:21:23Z',
    ResourceName: 'EC2Role',
    Service: 'IAM',
    Status: 'Created',
    UserName: 'ktou@dxc.com',
  });
};

start();
