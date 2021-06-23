import { Paths, SVG } from '@constants';
import { SERVICES } from './Consts';

const MENUS = [
  {
    eventSource: SERVICES.EC2,
    category: 'compute',
    title: 'Amazon EC2',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.EC2],
    icon: SVG.EC2Icon,
  },
  {
    eventSource: SERVICES.RDS,
    category: 'database',
    title: 'Amazon RDS',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RDS],
    icon: SVG.RDSIcon,
  },
  {
    eventSource: SERVICES.DYNAMODB,
    category: 'database',
    title: 'Amazon DYNAMODB',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.DYNAMODB],
    icon: SVG.DynamoDBIcon,
  },
  {
    eventSource: SERVICES.S3,
    category: 'storage',
    title: 'Amazon S3',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.S3],
    icon: SVG.S3Icon,
  },
  {
    eventSource: SERVICES.EFS,
    category: 'storage',
    title: 'Amazon EFS',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.EFS],
    icon: SVG.EFSIcon,
  },
  {
    eventSource: SERVICES.ELB,
    category: 'networking',
    title: 'Amazon ELB',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.ELB],
    icon: SVG.ELBIcon,
  },
  {
    eventSource: SERVICES.IAM,
    category: 'security',
    title: 'AWS IAM',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.IAM],
    icon: SVG.IAMIcon,
  },
  {
    eventSource: SERVICES.DS,
    category: 'security',
    title: 'AWS DIRECTORY SERVICE',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.DS],
    icon: SVG.DSIcon,
  },
  {
    eventSource: SERVICES.EKS,
    category: 'container',
    title: 'Amazon EKS',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.EKS],
    icon: SVG.EKSIcon,
  },
];

export default MENUS;
