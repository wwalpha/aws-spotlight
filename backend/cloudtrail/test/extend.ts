import { ExtendService } from '@src/services';

const array = [
  'arn:aws:backup:us-east-1:334678299258:backup-vault:Default',
  'arn:aws:s3:::aws-athena-query-results-334678299258-us-east-1',
  'arn:aws:glue:us-east-1:334678299258:database/default',
  'arn:aws:ec2:ap-northeast-1:334678299258:internet-gateway/igw-0edd3612557ae42b4',
  'arn:aws:ec2:ap-northeast-1:334678299258:natgateway/nat-0a3dc9fabae879b37',
  'arn:aws:ec2:ap-northeast-1:334678299258:instance/i-0167ec091a184a693',
  'arn:aws:sns:ap-northeast-1:334678299258:oc-admin',
  'arn:aws:lambda:ap-northeast-1:334678299258:function:oc-psw-reset',
  'arn:aws:ec2:ap-northeast-1:334678299258:vpc/vpc-08f77b07c34029b7a',
  'arn:aws:lambda:ap-northeast-1:334678299258:function:oc-create-account',
  'arn:aws:lambda:ap-northeast-1:334678299258:function:auto-register-ec2-public-ip-in-route53',
  'arn:aws:serverlessrepo:ap-northeast-1:334678299258:applications/AutoStartStop',
  'arn:aws:s3:::onecloud-serverless-repository',
  'arn:aws:s3:::cloudwatch-tools-ap-northeast-1',
  'arn:aws:lambda:ap-northeast-1:334678299258:function:onecloud-auto-stop-ontime',
  'arn:aws:s3:::pkc-frontend-376965',
  'arn:aws:s3:::pkc-materials-376965',
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
