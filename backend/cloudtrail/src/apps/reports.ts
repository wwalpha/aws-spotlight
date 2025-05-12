import { ExtendService, ResourceService, SettingService } from '@src/services';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { parse } from 'csv-parse/sync';
import { Consts } from './utils';
import { ResourcesCSV, Tables } from 'typings';

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const HEADER = ['UserName', 'Region', 'Service', 'ResourceName', 'EventName', 'EventTime', 'ResourceId'];

export const reports = async (): Promise<string[]> => {
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

  // 月次レポートデータ
  await montlyReports(filteredResources);

  return await montlyReportsFullVer(filteredResources);
};

const montlyReports = async (resources: Tables.TResource[]): Promise<string[]> => {
  const dataRows: string[] = [];
  // title
  dataRows.push(HEADER.join(','));
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

  return dataRows;
};

const montlyReportsFullVer = async (resources: Tables.TResource[]): Promise<string[]> => {
  const dataRows: string[] = [];

  // title
  dataRows.push(HEADER.join(','));

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

  return dataRows;
};

const getTwoMonthsAgoStartOfMonth = (): string => {
  const date = new Date();
  date.setMonth(date.getMonth() - 2, 1); // 2か月前の月初に設定
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01T00:00:00Z`;
};

export const personalResport = async (userName: string): Promise<string> => {
  const resources = await reports();
  const dataRows: string[] = [];
  // title
  dataRows.push(HEADER.join(','));

  const records: ResourcesCSV[] = parse(resources.join('\n'), {
    columns: true,
    skip_empty_lines: true,
  });

  const tasks = records.map(async (item) => {
    // 同じユーザの確認
    if (item.UserName !== userName) return;

    const result = await ExtendService.describe({
      ResourceId: item.ResourceId,
    });

    if (result !== undefined) return;

    return item;
  });

  const results = await Promise.all(tasks);

  results
    .filter((item) => item !== undefined)
    .forEach((item) =>
      dataRows.push(
        `"${item.UserName}","${item.Region}","${item.Service}","${item.ResourceName}","${item.EventName}","${item.EventTime}","${item.ResourceId}"`
      )
    );

  const contents = dataRows.join('\n');
  const objectKey = `Reports/${new Date().toISOString()}_${userName}.csv`;

  const s3Client = new S3Client({ region: process.env.AWS_REGION });

  // upload
  await s3Client.send(
    new PutObjectCommand({
      Bucket: Consts.Environments.S3_BUCKET_MATERIALS,
      Key: objectKey,
      Body: contents,
    })
  );

  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: Consts.Environments.S3_BUCKET_MATERIALS,
      Key: objectKey,
    }),
    { expiresIn: 3600 }
  );

  return url;
};
