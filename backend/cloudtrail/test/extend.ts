import { ExtendService } from '@src/services';

const array = [
  'arn:aws:sns:ap-northeast-1:334678299258:oc-admin',
  'arn:aws:glue:us-east-1:334678299258:database/default',
  'arn:aws:lambda:us-east-1:334678299258:function:spotlight-cloudtrail-process-dev',
  'arn:aws:ec2:ap-northeast-1:334678299258:customer-gateway/cgw-0ebe6c23091a3cda2',
  'arn:aws:s3:::aws-quicksetup-patchpolicy-access-log-334678299258-b6d4-kc5jr',
  'arn:aws:cloudformation:ap-northeast-1:334678299258:stack/AWS-QuickSetup-PatchPolicy-LocalDeploymentRolesStack',
  'arn:aws:dynamodb:us-east-1:334678299258:table/spotlight-extend-dev',
  'arn:aws:apigateway:us-east-1::/apis/70hyvlp7x9',
  'arn:aws:s3:::cloudwatch-tools-ap-northeast-1',
  'arn:aws:lambda:us-east-1:334678299258:function:spotlight-report-dev',
  'arn:aws:lambda:ap-northeast-1:334678299258:function:oc-psw-reset',
  'arn:aws:cloudformation:ap-northeast-1:334678299258:stackset/AWS-QuickSetup-PatchPolicy-LA-kc5jr:9d3a1ac5-786d-4ca0-8bbd-45dab5f2fba2',
  'arn:aws:dynamodb:us-east-1:334678299258:table/spotlight-settings-dev',
  'arn:aws:s3:::codepipeline-ap-northeast-1-0b45868013b3-44d7-9b15-c6f9dfd05341',
  'arn:aws:s3:::spotlight-material-us-east-1-dev',
  'arn:aws:lambda:ap-northeast-1:334678299258:function:oc-create-account',
  'arn:aws:ec2:ap-northeast-1:334678299258:instance/i-0167ec091a184a693',
  'arn:aws:s3:::aws-athena-query-results-334678299258-us-east-1',
  'arn:aws:backup:us-east-1:334678299258:backup-vault:Default',
  'arn:aws:s3:::pkc-frontend-376965',
  'arn:aws:sns:us-east-1:334678299258:spotlight-admin-dev',
  'arn:aws:lambda:us-east-1:334678299258:function:spotlight-monthly-cleanup-dev',
  'arn:aws:ecr:us-east-1:334678299258:repository/spotlight/cloudtrail-dev',
  'arn:aws:lambda:us-east-1:334678299258:function:spotlight-dailybatch-dev',
];

const start = async () => {
  const tasks = array.map(async (item) => {
    await ExtendService.regist({
      ResourceId: item,
      UserName: 'ktou@dxc.com',
      expiresAt: 4102444800,
    });
  });

  await Promise.all(tasks);
};

start();
