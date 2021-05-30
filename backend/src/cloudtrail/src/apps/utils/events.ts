import * as CreateEvent from '@src/process/create';
import * as DeleteEvent from '@src/process/delete';
import { CloudTrail, Tables } from 'typings';

export const getCreateResourceItem = (record: CloudTrail.Record): Tables.Resource | undefined => {
  const { eventName, eventSource } = record;
  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;

  switch (key) {
    case 'APIGATEWAY_CreateRestApi':
      return CreateEvent.APIGATEWAY_CreateRestApi(record);
    case 'APIGATEWAY_ImportRestApi':
      return CreateEvent.APIGATEWAY_ImportRestApi(record);

    case 'EC2_RunInstances':
      return CreateEvent.EC2_RunInstances(record);
    case 'EC2_CreateImage':
      return CreateEvent.EC2_CreateImage(record);
    case 'EC2_CreateSnapshot':
      return CreateEvent.EC2_CreateSnapshot(record);
    case 'EC2_CreateSnapshots':
      return CreateEvent.EC2_CreateSnapshots(record);

    case 'DYNAMODB_CreateTable':
      return CreateEvent.DYNAMODB_CreateTable(record);

    case 'ELASTICLOADBALANCING_CreateLoadBalancer':
      return CreateEvent.ELASTICLOADBALANCING_CreateLoadBalancer(record);
    case 'ELASTICLOADBALANCING_CreateTargetGroup':
      return CreateEvent.ELASTICLOADBALANCING_CreateTargetGroup(record);

    case 'RDS_CreateDBCluster':
      return CreateEvent.RDS_CreateDBCluster(record);
    case 'RDS_CreateDBInstance':
      return CreateEvent.RDS_CreateDBInstance(record);

    default:
      return undefined;
  }
};

export const getRemoveResourceItem = (record: CloudTrail.Record): Tables.ResouceKey | undefined => {
  const { eventName, eventSource } = record;
  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;

  switch (key) {
    case 'APIGATEWAY_DeleteRestApi':
      return DeleteEvent.APIGATEWAY_DeleteRestApi(record);

    case 'DYNAMODB_DeleteTable':
      return DeleteEvent.DYNAMODB_DeleteTable(record);

    case 'EC2_TerminateInstances':
      return DeleteEvent.EC2_TerminateInstances(record);
    case 'EC2_DeregisterImage':
      return DeleteEvent.EC2_DeregisterImage(record);
    case 'EC2_DeleteSnapshot':
      return DeleteEvent.EC2_DeleteSnapshot(record);

    case 'ELASTICLOADBALANCING_DeleteLoadBalancer':
      return DeleteEvent.ELASTICLOADBALANCING_DeleteLoadBalancer(record);
    case 'ELASTICLOADBALANCING_DeleteTargetGroup':
      return DeleteEvent.ELASTICLOADBALANCING_DeleteTargetGroup(record);

    case 'RDS_DeleteDBCluster':
      return DeleteEvent.RDS_DeleteDBCluster(record);
    case 'RDS_DeleteDBInstance':
      return DeleteEvent.RDS_DeleteDBInstance(record);

    default:
      return undefined;
  }
};
