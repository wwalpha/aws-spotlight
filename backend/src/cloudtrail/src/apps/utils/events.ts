import {
  EC2_RunInstances,
  APIGATEWAY_CreateRestApi,
  APIGATEWAY_ImportRestApi,
  RDS_CreateDBCluster,
  RDS_CreateDBInstance,
  ELASTICLOADBALANCING_CreateLoadBalancer,
  ELASTICLOADBALANCING_CreateTargetGroup,
  DYNAMODB_CreateTable,
} from '@src/process/create';
import {
  APIGATEWAY_DeleteRestApi,
  DYNAMODB_DeleteTable,
  EC2_TerminateInstances,
  ELASTICLOADBALANCING_DeleteLoadBalancer,
  ELASTICLOADBALANCING_DeleteTargetGroup,
  RDS_DeleteDBCluster,
  RDS_DeleteDBInstance,
} from '@src/process/delete';
import { CloudTrail, Tables } from 'typings';

export const getCreateResourceItem = (record: CloudTrail.Record): Tables.Resource | undefined => {
  const { eventName, eventSource } = record;
  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;

  switch (key) {
    case 'EC2_RunInstances':
      return EC2_RunInstances(record);
    case 'APIGATEWAY_CreateRestApi':
      return APIGATEWAY_CreateRestApi(record);
    case 'APIGATEWAY_ImportRestApi':
      return APIGATEWAY_ImportRestApi(record);
    case 'RDS_CreateDBCluster':
      return RDS_CreateDBCluster(record);
    case 'RDS_CreateDBInstance':
      return RDS_CreateDBInstance(record);
    case 'ELASTICLOADBALANCING_CreateLoadBalancer':
      return ELASTICLOADBALANCING_CreateLoadBalancer(record);
    case 'ELASTICLOADBALANCING_CreateTargetGroup':
      return ELASTICLOADBALANCING_CreateTargetGroup(record);
    case 'DYNAMODB_CreateTable':
      return DYNAMODB_CreateTable(record);

    default:
      return undefined;
  }
};

export const getRemoveResourceItem = (record: CloudTrail.Record): Tables.ResouceKey | undefined => {
  const { eventName, eventSource } = record;
  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;

  switch (key) {
    case 'APIGATEWAY_DeleteRestApi':
      return APIGATEWAY_DeleteRestApi(record);
    case 'EC2_TerminateInstances':
      return EC2_TerminateInstances(record);
    case 'RDS_DeleteDBCluster':
      return RDS_DeleteDBCluster(record);
    case 'RDS_DeleteDBInstance':
      return RDS_DeleteDBInstance(record);
    case 'ELASTICLOADBALANCING_DeleteLoadBalancer':
      return ELASTICLOADBALANCING_DeleteLoadBalancer(record);
    case 'ELASTICLOADBALANCING_DeleteTargetGroup':
      return ELASTICLOADBALANCING_DeleteTargetGroup(record);
    case 'DYNAMODB_DeleteTable':
      return DYNAMODB_DeleteTable(record);

    default:
      return undefined;
  }
};
