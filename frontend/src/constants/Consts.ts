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
};

export const API_URLs = {
  SignIn: '/auth',
  GetCategories: '/resources/categories',
  GetResources: (service: string) => `/resources/services/${service}`,
};
