import { cloudtrail, unprocessed } from '@src/index';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Tables } from 'typings';
import { SQS } from 'aws-sdk';
import { SQSRecord } from 'aws-lambda';

const helper = new DynamodbHelper();

const startU = async () => {
  // await helper.put({
  //   TableName: process.env.TABLE_UNPROCESSED as string,
  //   Item: {
  //     EventName: 'RunInstances',
  //     EventTime: '2021-04-07T15:53:12Z_ce2437c8',
  //     Raw: JSON.stringify(require('./RunInstances.json')),
  //   } as Tables.Unprocessed,
  // });

  await unprocessed();
};

const startC = async () => {
  const client = new SQS();

  for (;;) {
    const results = await client
      .receiveMessage({
        QueueUrl: process.env.SQS_URL as string,
        MaxNumberOfMessages: 10,
      })
      .promise();

    if (results.Messages === undefined) {
      break;
    }

    const records = results.Messages?.map(
      (item) =>
        ({
          awsRegion: 'ap-northeast-1',
          body: item.Body as string,
          md5OfBody: item.MD5OfBody as string,
          attributes: item.Attributes as any,
          receiptHandle: item.ReceiptHandle as string,
          messageAttributes: item.MessageAttributes as any,
          messageId: item.MessageId as string,
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012',
        } as SQSRecord)
    );

    if (!records) return;

    await cloudtrail({
      Records: records,
    });
  }
};

startC();
