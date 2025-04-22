import { ResourceService, SettingService } from '@src/services';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Consts } from './utils';
import { Tables } from 'typings';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export const reports = async (): Promise<void> => {
  const resources = await ResourceService.listResources();
  const filters = await SettingService.describe('REPORT_FILTERS');
  const filterServices: Record<string, string[]> = filters?.Services || {};
  const filterServiceKeys = Object.keys(filterServices);

  const filteredResources = resources.filter((item) => {
    const arns = item.ResourceId.split(':');
    const service = arns[2];

    // ignore iam create access key
    if (item.EventSource === 'iam.amazonaws.com' && item.EventName === 'CreateAccessKey') {
      return false;
    }

    // invalid arn
    if (arns.length < 6) {
      console.log('Invalid ARN', item.ResourceId);
      return false;
    }

    const subsystem = arns[5].indexOf('/') !== -1 ? arns[5].split('/')[0] : arns[5];

    // filter
    if (filterServiceKeys.includes(service) && filterServices[service].includes(subsystem)) {
      return false;
    }

    return true;
  });

  await montlyReports(filteredResources);
  await montlyReportsFullVer(filteredResources);
};

const montlyReports = async (resources: Tables.TResource[]) => {
  const dataRows: string[] = [];
  // title
  dataRows.push('"UserName","Region","Service","ResourceName","EventName","EventTime","ResourceId"');
  const reportTime = getTwoMonthsAgoStartOfMonth();

  resources.forEach((item) => {
    if (item.EventTime < '2023-01-01T00:00:00Z') return;
    if (item.EventTime > reportTime) return;
    if (item.UserName === 'AWSServiceRoleForAmazonSageMakerNotebooks') return;
    if (item.UserName === 'AWSServiceRoleForAutoScaling') return;
    if (item.UserName === 'AWSServiceRoleForBatch') return;
    if (item.UserName === 'AWSServiceRoleForLambdaReplicator') return;
    if (item.UserName === 'AWSServiceRoleForAmazonElasticFileSystem') return;
    if (item.UserName === 'AWSServiceRoleForAWSCloud9') return;
    if (item.UserName === 'AWSBackupDefaultServiceRole') return;
    if (item.UserName === 'ARMS_GitHubService') return;
    if (item.UserName.startsWith('cdk-hnb659fds-')) return;
    if (item.UserName === 'stacksets-exec-50af2a55fae86a1fac66dddb5f92b810') return;
    if (item.EventName === 'CreateBackupVault' && item.ResourceName === 'Default') return;

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

const montlyReportsFullVer = async (resources: Tables.TResource[]): Promise<void> => {
  const dataRows: string[] = [];

  // title
  dataRows.push('"UserName","Region","Service","ResourceName","EventName","EventTime","ResourceId"');

  resources.forEach((item) => {
    // rows
    dataRows.push(
      `"${item.UserName}","${item.AWSRegion}","${item.Service}","${item.ResourceName}","${item.EventName}","${item.EventTime.substring(
        0,
        10
      )}","${item.ResourceId}"`
    );
  });

  const contents = dataRows.join('\n');
  const objectKey = `Reports/${new Date().toISOString()}_FULLVER.csv`;

  // upload
  await s3Client.send(
    new PutObjectCommand({
      Bucket: Consts.Environments.S3_BUCKET_MATERIALS,
      Key: objectKey,
      Body: contents,
    })
  );
};

const getTwoMonthsAgoStartOfMonth = (): string => {
  const date = new Date();
  date.setMonth(date.getMonth() - 2, 1); // 2か月前の月初に設定
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01T00:00:00Z`;
};
