export const API_NAME = 'api';

export const GET_RESOURCES_URL = (service: string) => `/resources/${service}`;

export const SERVICES = {
  EC2: 'ec2.amazonaws.com',
  RDS: 'rds.amazonaws.com',
  APIGATEWAY: 'apigateway.amazonaws.com',
  DYNAMODB: 'dynamodb.amazonaws.com',
  EKS: 'eks.amazonaws.com',
};

export const API_URLs = {
  SignIn: '/auth',
};
