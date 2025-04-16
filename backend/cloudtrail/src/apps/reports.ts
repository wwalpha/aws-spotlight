import { ResourceService, SettingService } from '@src/services';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Consts } from './utils';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export const reports = async (): Promise<void> => {
  const resources = await ResourceService.listResources();
  const filters = await SettingService.describe('REPORT_FILTERS');
  const filterServices: Record<string, string[]> = filters?.Services || {};
  const filterServiceKeys = Object.keys(filterServices);
  const dataRows: string[] = [];

  // title
  dataRows.push('"UserName","Region","Service","ResourceName","EventName","EventTime","ResourceId"');

  resources.forEach((item) => {
    const arns = item.ResourceId.split(':');
    const service = arns[2];

    // ignore iam create access key
    if (item.EventSource === 'iam.amazonaws.com' && item.EventName === 'CreateAccessKey') {
      return;
    }

    // invalid arn
    if (arns.length < 6) {
      console.log('Invalid ARN', item.ResourceId);
      return;
    }

    const subsystem = arns[5].indexOf('/') !== -1 ? arns[5].split('/')[0] : arns[5];

    // filter
    if (filterServiceKeys.includes(service) && filterServices[service].includes(subsystem)) {
      return;
    }

    // rows
    dataRows.push(
      `"${item.UserName}","${item.AWSRegion}","${item.Service}","${item.ResourceName}","${item.EventName}","${item.EventTime.substring(
        0,
        10
      )}","${item.ResourceId}"`
    );
  });

  const contents = dataRows.join('\n');
  const objectKey = `Reports/${new Date().toISOString()}.csv`;

  // upload
  await s3Client.send(
    new PutObjectCommand({
      Bucket: Consts.Environments.S3_BUCKET_MATERIALS,
      Key: objectKey,
      Body: contents,
    })
  );
};

// reports();
