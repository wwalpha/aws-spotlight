import { SQS } from 'aws-sdk';
import * as fs from 'fs';

const start = async () => {
  const client = new SQS({ region: 'ap-northeast-1' });

  await client
    .purgeQueue({
      QueueUrl: process.env.SQS_URL as string,
    })
    .promise();

  const lines = fs.readFileSync('./results').toString().split('\n');

  for (let i = 0; i < 2000; i++) {
    const items = lines.splice(0, 5);

    await client
      .sendMessage({
        QueueUrl: process.env.SQS_URL as string,
        MessageBody: JSON.stringify({
          s3Bucket: 'arms-test-0516',
          s3ObjectKey: items,
        }),
      })
      .promise();

      
  }
};

start();
