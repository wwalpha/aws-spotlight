import { Environments } from '@src/consts';
import { ResourceService } from '@src/services';
import { S3 } from 'aws-sdk';

const client = new S3({ region: process.env.AWS_REGION });

export const reports = async (): Promise<string> => {
  const resources = await ResourceService.listResources();
  const dataRows = new Array();

  // title
  dataRows.push('"UserName","Service","ResourceName","EventName","ResourceId"');

  resources.forEach((item) => {
    // rows
    dataRows.push(
      `"${item.UserName}","${item.Service}","${item.ResourceName}","${item.EventName}","${item.ResourceId}"`
    );
  });

  const contents = dataRows.join('\n');
  const objectKey = `reports/${new Date().toISOString()}.csv`;

  // upload
  await client
    .putObject({
      Bucket: Environments.S3_BUCKET_ARCHIVE,
      Key: objectKey,
      Body: contents,
    })
    .promise();

  return contents;
};
