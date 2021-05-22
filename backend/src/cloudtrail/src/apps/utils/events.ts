import {
  EC2_RunInstances,
  APIGATEWAY_CreateRestApi,
  APIGATEWAY_ImportRestApi,
  RDS_CreateDBCluster,
  RDS_CreateDBInstance,
} from '@src/process/create';
import {
  APIGATEWAY_DeleteRestApi,
  EC2_TerminateInstances,
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

    default:
      return undefined;
  }
};
