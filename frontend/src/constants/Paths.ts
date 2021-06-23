export const ROUTE_PATH_INDEX = {
  Root: 0,
  SignIn: 1,
  Login: 2,
  Service: 100,
  EC2: 101,
  RDS: 102,
  DYNAMODB: 103,
  APIGATEWAY: 104,
  ELB: 105,
  EKS: 106,
  EFS: 107,
  S3: 108,
  DS: 109,
  IAM: 110,
  LAMBDA: 111,
};

export const ROUTE_PATHS = {
  [ROUTE_PATH_INDEX.Root]: '/',
  [ROUTE_PATH_INDEX.SignIn]: '/signin',
  [ROUTE_PATH_INDEX.Login]: '/login',
  [ROUTE_PATH_INDEX.Service]: '/service',
  [ROUTE_PATH_INDEX.EC2]: '/service/ec2',
  [ROUTE_PATH_INDEX.RDS]: '/service/rds',
  [ROUTE_PATH_INDEX.DYNAMODB]: '/service/dynamodb',
  [ROUTE_PATH_INDEX.APIGATEWAY]: '/service/apigateway',
  [ROUTE_PATH_INDEX.ELB]: '/service/elasticloadbalancing',
  [ROUTE_PATH_INDEX.EKS]: '/service/eks',
  [ROUTE_PATH_INDEX.EFS]: '/service/elasticfilesystem',
  [ROUTE_PATH_INDEX.S3]: '/service/s3',
  [ROUTE_PATH_INDEX.DS]: '/service/ds',
  [ROUTE_PATH_INDEX.IAM]: '/service/iam',
  [ROUTE_PATH_INDEX.LAMBDA]: '/service/lambda',
};
