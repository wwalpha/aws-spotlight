import { ResourceARNs } from '@src/apps/utils';
import { ResourceService, UnprocessedService } from '@src/services';
import { CloudTrailRecord } from 'typings';

const users: Record<string, string> = {};

export const getUserName = async (record: CloudTrailRecord) => {
  const { awsRegion: region, recipientAccountId: account, userName, eventSource, eventName, userAgent } = record;
  const serviceName = eventSource.split('.')[0].toUpperCase();
  const key = `${serviceName}_${eventName}`;
  const request = record.requestParameters ? JSON.parse(record.requestParameters) : {};
  const response = record.responseElements ? JSON.parse(record.responseElements) : {};

  // ユーザ名が空の場合、処理しない
  if (userName === '') return userName;
  if (userName === 'ARMS_GitHubService') return userName;
  if (userName === 'test002') return userName;

  // AWSServiceRole から始まる場合は、ユーザ名を検索する
  if (userName.startsWith('AWSServiceRole')) {
    return await checkAWSServiceRole(record);
  }
  // dxc.com の場合、ユーザ名は変更しない
  if (userName.endsWith('@dxc.com') || userName.endsWith('@amazon.co.jp')) return userName;

  // AWSBackupDefault から始まる場合は、ユーザ名は変更しない
  if (userName.startsWith('AWSBackupDefault')) return userName;
  if (key === 'EC2_RunInstances' && userName.startsWith('ara-')) return userName;
  if (key === 'EC2_TerminateInstances') return userName;
  if (key === 'LAMBDA_DeleteFunction20150331') return userName;
  if (key === 'COGNITO-IDP_DeleteUserPool') return userName;
  if (key === 'CLOUDFORMATION_DeleteStack') return userName;

  // IAM DeleteRole
  if (key === 'IAM_DeleteRole') {
    // arn
    const resourceId = ResourceARNs.IAM_Role(region, account, request.roleName);

    // ユーザ名を取得する
    return await getResourceUserName(resourceId, record);
  }

  // Lambda CreateFunction
  if (key === 'LAMBDA_CreateFunction20150331') {
    const functionName: string = request.functionName ?? response.functionName;

    // amplifyから作成されたリソースの場合、ユーザ名は変更しない
    if (functionName.startsWith('amplify-')) {
      // amplify backendの場合、ユーザ名は変更しない
      if (userAgent === 'amplifybackend.amazonaws.com' || userAgent === 'cloudformation.amazonaws.com') {
        return userName;
      }

      // arn
      const resourceId = ResourceARNs.AMPLIFY_App(region, account, functionName.split('-')[1]);

      const results = await ResourceService.describe({
        ResourceId: resourceId,
      });

      if (results !== undefined) {
        return results.UserName;
      }
    }
  }

  // S3 CreateBucket
  if (key === 'S3_CreateBucket') {
    const bucketName = request.bucketName;

    // amplifyから作成されたリソースの場合、ユーザ名は変更しない
    if (bucketName.startsWith('amplify-')) {
      // arn
      const resourceId = ResourceARNs.S3_Bucket(region, account, bucketName);
      // ユーザ名を取得する
      return await getResourceUserName(resourceId, record);
    }
  }

  if (Object.keys(users).includes(userName)) return users[userName];

  // ロールの作成者を検索する
  let newUserName = await ResourceService.getUserName(ResourceARNs.IAM_Role(region, account, userName));

  if (newUserName === undefined) {
    newUserName = await ResourceService.getUserName(ResourceARNs.IAM_ServiceRole(region, account, userName));
  }

  // ユーザ名が見つからない場合、未処理テーブルの一次保管する
  if (newUserName === undefined) {
    // cloudformation で代行生成の場合、ユーザ名は分からない
    // if (userAgent === 'cloudformation.amazonaws.com') {
    //   return userName;
    // }

    await UnprocessedService.tempSave(record);
    return userName;
  }

  // backup
  users[userName] = newUserName;

  return newUserName;
};

const checkAWSServiceRole = async (record: CloudTrailRecord) => {
  const { awsRegion: region, recipientAccountId: account, userName, userAgent } = record;
  const serviceName = record.eventSource.split('.')[0].toUpperCase();
  const key = `${serviceName}_${record.eventName}`;
  const request = record.requestParameters ? JSON.parse(record.requestParameters) : {};
  const response = record.responseElements ? JSON.parse(record.responseElements) : {};

  // 対象外イベントの場合、そのまま返却
  if (userName === 'AWSServiceRoleForBatch' && userAgent === 'batch.amazonaws.com') {
    // イベント名チェック
    if (!['ECS_CreateCluster', 'ECS_DeleteCluster'].includes(key)) return record.userName;

    // ECS の場合、クラスター名を取得する
    const clusterName = response.cluster.clusterName as string;
    // クラスター名から ComputeEnvironment 名を取得する
    const batchEnvName = clusterName.substring(9, clusterName.length - 37);
    // ComputeEnvironment 名から ARN を取得する
    const batchArn = ResourceARNs.BATCH_COMPUTE_ENVIRONMENT(region, account, batchEnvName);
    // ユーザ名を取得する
    return await getResourceUserName(batchArn, record);
  }

  if (userName === 'AWSServiceRoleForAmazonSageMakerNotebooks') {
    // SageMaker の場合、ドメイン名を取得する
    const creationToken = request.creationToken as string;
    // ドメイン名から ARN を取得する
    const domainArn = ResourceARNs.SAGEMAKER_Domain(region, account, creationToken);
    // ユーザ名を取得する
    return await getResourceUserName(domainArn, record);
  }

  return record.userName;
};

const getResourceUserName = async (resourceId: string, record: CloudTrailRecord) => {
  const results = await ResourceService.describe({
    ResourceId: resourceId,
  });

  if (results === undefined) {
    await UnprocessedService.tempSave(record);
    return record.userName;
  }

  return results.UserName;
};
