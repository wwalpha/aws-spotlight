import { Paths, SVG } from '@constants';
import { SERVICES } from './Consts';

const MENUS = [
  {
    EventSource: SERVICES.EC2,
    title: 'Amazon EC2',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.EC2],
    icon: SVG.EC2Icon,
  },
  {
    EventSource: SERVICES.RDS,
    title: 'Amazon RDS',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RDS],
    icon: SVG.RDSIcon,
  },
  {
    EventSource: SERVICES.DYNAMODB,
    title: 'Amazon DYNAMODB',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.DYNAMODB],
    icon: SVG.DynamoDBIcon,
  },
  {
    EventSource: SERVICES.ELB,
    title: 'Amazon ELB',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.ELB],
    icon: SVG.ELBIcon,
  },
  {
    EventSource: SERVICES.EKS,
    title: 'Amazon EKS',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.EKS],
    icon: SVG.EKSIcon,
  },
  {
    EventSource: SERVICES.EFS,
    title: 'Amazon EFS',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.EFS],
    icon: SVG.EFSIcon,
  },
  {
    EventSource: SERVICES.S3,
    title: 'Amazon S3',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.S3],
    icon: SVG.S3Icon,
  },
  {
    EventSource: SERVICES.DS,
    title: 'AWS DIRECTORY SERVICE',
    path: Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.DS],
    icon: SVG.DSIcon,
  },
];

export default MENUS;
