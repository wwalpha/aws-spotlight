export const API_NAME = 'api';

export const SERVICES = {
  EC2: 'ec2.amazonaws.com',
  RDS: 'rds.amazonaws.com',
  APIGATEWAY: 'apigateway.amazonaws.com',
  DYNAMODB: 'dynamodb.amazonaws.com',
  EKS: 'eks.amazonaws.com',
  EFS: 'elasticfilesystem.amazonaws.com',
  ELB: 'elasticloadbalancing.amazonaws.com',
  S3: 's3.amazonaws.com',
  DS: 'ds.amazonaws.com',
  IAM: 'iam.amazonaws.com',
  LAMBDA: 'lambda.amazonaws.com',
  ES: 'es.amazonaws.com',
  REDSHIFT: 'redshift.amazonaws.com',
  CODEBUILD: 'codebuild.amazonaws.com',
  APPMESH: 'appmesh.amazonaws.com',
  ROUTE53: 'route53.amazonaws.com',
  SNS: 'sns.amazonaws.com',
  SQS: 'sqs.amazonaws.com',
  CONNECT: 'connect.amazonaws.com',
  FIREHOSE: 'firehose.amazonaws.com',
  KINESIS: 'kinesis.amazonaws.com',
  CLOUDFRONT: 'cloudfront.amazonaws.com',
  LEX: 'lex.amazonaws.com',
  STEP_FUNCTION: 'states.amazonaws.com',
};

export const API_URLs = {
  SignIn: '/auth',
  InitiateAuth: '/auth/initiate',
  GetCategories: '/resources/categories',
  GetReports: '/resources/reports',
  GetResources: (service: string) => `/resources/services/${service}`,
  GetReleaseNotes: '/system/releases',
  GetVersion: '/system/version',
};
