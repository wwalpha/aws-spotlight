import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient());
const TALBE_EXTEND = process.env.TALBE_EXTEND as string;

export interface Event {
  arn: string;
  months: number;
  userName: string;
}

export const handler = async (event: Event) => {
  const { arn, months, userName } = event;
  const time = getUnixTime(months);

  await client.send(
    new PutCommand({
      TableName: TALBE_EXTEND,
      Item: {
        ResourceId: arn,
        expiresAt: time,
        UserName: userName,
      },
      ConditionExpression: 'attribute_not_exists(ResourceId) OR expiresAt < :time',
    })
  );
};

const getUnixTime = (months: number): number => {
  // 2か月後の月末のUNIX時間を計算
  const date = new Date();
  // 月末に設定
  date.setMonth(date.getMonth() + months, 0);
  // UNIX時間に変換
  return Math.floor(date.getTime() / 1000);
};
