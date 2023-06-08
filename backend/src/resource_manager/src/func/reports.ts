import { Environments } from '@src/consts';
import { ResourceService } from '@src/services';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const snsClient = new SNSClient({ region: process.env.AWS_REGION });

export const reports = async (): Promise<void> => {
  const resources = await ResourceService.listResources();
  const dataRows = new Array();

  // title
  dataRows.push('"UserName","Service","ResourceName","EventName","EventTime","ResourceId"');

  resources.forEach((item) => {
    // rows
    dataRows.push(
      `"${item.UserName}","${item.Service}","${item.ResourceName}","${item.EventName}","${item.EventTime}","${item.ResourceId}"`
    );
  });

  const contents = dataRows.join('\n');
  const objectKey = `reports/${new Date().toISOString()}.csv`;

  // upload
  await s3Client.send(
    new PutObjectCommand({
      Bucket: Environments.S3_BUCKET_ARCHIVE,
      Key: objectKey,
      Body: contents,
    })
  );

  const signedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: Environments.S3_BUCKET_ARCHIVE,
      Key: objectKey,
    }),
    {
      expiresIn: 60 * 60 * 24,
    }
  );

  // send to admin
  await snsClient.send(
    new PublishCommand({
      TopicArn: Environments.SNS_TOPIC_ARN_ADMIN,
      Subject: 'AWS Resource report',
      Message: `Report URL: ${signedUrl}`,
    })
  );
};