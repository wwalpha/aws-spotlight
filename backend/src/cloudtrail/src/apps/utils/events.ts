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

    case 'AUTOSCALING_CreateAutoScalingGroup':
      return CreateEvent.AUTOSCALING_CreateAutoScalingGroup(record);

    case 'DYNAMODB_CreateTable':
      return CreateEvent.DYNAMODB_CreateTable(record);
    case 'DS_CreateMicrosoftAD':
      return CreateEvent.DS_CreateMicrosoftAD(record);

    case 'EC2_RunInstances':
      return CreateEvent.EC2_RunInstances(record);
    case 'EC2_CreateImage':
      return CreateEvent.EC2_CreateImage(record);
    case 'EC2_CreateSnapshot':
      return CreateEvent.EC2_CreateSnapshot(record);
    case 'EC2_CreateSnapshots':
      return CreateEvent.EC2_CreateSnapshots(record);
    case 'EC2_CreateNatGateway':
      return CreateEvent.EC2_CreateNatGateway(record);
    case 'EC2_CreateClientVpnEndpoint':
      return CreateEvent.EC2_CreateClientVpnEndpoint(record);
    case 'EC2_CreateVpcPeeringConnection':
      return CreateEvent.EC2_CreateVpcPeeringConnection(record);
    case 'EC2_CreateVpc':
      return CreateEvent.EC2_CreateVpc(record);
    case 'EC2_CreateVolume':
      return CreateEvent.EC2_CreateVolume(record);
    case 'EC2_CreateVpcEndpoint':
      return CreateEvent.EC2_CreateVpcEndpoint(record);

    case 'ELASTICFILESYSTEM_CreateFileSystem':
      return CreateEvent.ELASTICFILESYSTEM_CreateFileSystem(record);

    case 'ELASTICLOADBALANCING_CreateLoadBalancer':
      return CreateEvent.ELASTICLOADBALANCING_CreateLoadBalancer(record);
    case 'ELASTICLOADBALANCING_CreateTargetGroup':
      return CreateEvent.ELASTICLOADBALANCING_CreateTargetGroup(record);

    case 'EKS_CreateCluster':
      return CreateEvent.EKS_CreateCluster(record);

    case 'IAM_CreateAccessKey':
      return CreateEvent.IAM_CreateAccessKey(record);
    case 'IAM_CreateRole':
      return CreateEvent.IAM_CreateRole(record);

    case 'LAMBDA_CreateFunction20150331':
      return CreateEvent.LAMBDA_CreateFunction20150331(record);

    case 'MONITORING_PutMetricAlarm':
      return CreateEvent.MONITORING_PutMetricAlarm(record);

    case 'RDS_CreateDBCluster':
      return CreateEvent.RDS_CreateDBCluster(record);
    case 'RDS_CreateDBInstance':
      return CreateEvent.RDS_CreateDBInstance(record);
    case 'REDSHIFT_CreateCluster':
      return CreateEvent.REDSHIFT_CreateCluster(record);

    case 'S3_CreateBucket':
      return CreateEvent.S3_CreateBucket(record);

    default:
      return undefined;
  }
};

export const getRemoveResourceItem = (record: CloudTrail.Record): Tables.ResourceKey[] | undefined => {
  const { eventName, eventSource } = record;
  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;

  switch (key) {
    case 'APIGATEWAY_DeleteRestApi':
      return [DeleteEvent.APIGATEWAY_DeleteRestApi(record)];
    case 'AUTOSCALING_DeleteAutoScalingGroup':
      return [DeleteEvent.AUTOSCALING_DeleteAutoScalingGroup(record)];

    case 'DYNAMODB_DeleteTable':
      return [DeleteEvent.DYNAMODB_DeleteTable(record)];
    case 'DS_DeleteDirectory':
      return [DeleteEvent.DS_DeleteDirectory(record)];

    case 'EC2_TerminateInstances':
      return [DeleteEvent.EC2_TerminateInstances(record)];
    case 'EC2_DeregisterImage':
      return [DeleteEvent.EC2_DeregisterImage(record)];
    case 'EC2_DeleteSnapshot':
      return [DeleteEvent.EC2_DeleteSnapshot(record)];
    case 'EC2_DeleteNatGateway':
      return [DeleteEvent.EC2_DeleteNatGateway(record)];
    case 'EC2_DeleteClientVpnEndpoint':
      return [DeleteEvent.EC2_DeleteClientVpnEndpoint(record)];
    case 'EC2_DeleteVpcPeeringConnection':
      return [DeleteEvent.EC2_DeleteVpcPeeringConnection(record)];
    case 'EC2_DeleteVpc':
      return [DeleteEvent.EC2_DeleteVpc(record)];
    case 'EC2_DeleteVolume':
      return [DeleteEvent.EC2_DeleteVolume(record)];
    case 'EC2_DeleteVpcEndpoints':
      return [DeleteEvent.EC2_DeleteVpcEndpoints(record)];

    case 'ELASTICFILESYSTEM_DeleteFileSystem':
      return [DeleteEvent.ELASTICFILESYSTEM_DeleteFileSystem(record)];

    case 'ELASTICLOADBALANCING_DeleteLoadBalancer':
      return [DeleteEvent.ELASTICLOADBALANCING_DeleteLoadBalancer(record)];
    case 'ELASTICLOADBALANCING_DeleteTargetGroup':
      return [DeleteEvent.ELASTICLOADBALANCING_DeleteTargetGroup(record)];

    case 'EKS_DeleteCluster':
      return [DeleteEvent.EKS_DeleteCluster(record)];

    case 'IAM_DeleteAccessKey':
      return [DeleteEvent.IAM_DeleteAccessKey(record)];
    case 'IAM_DeleteRole':
      return [DeleteEvent.IAM_DeleteRole(record)];

    case 'LAMBDA_DeleteFunction20150331':
      return [DeleteEvent.LAMBDA_DeleteFunction20150331(record)];

    case 'MONITORING_DeleteAlarms':
      return DeleteEvent.MONITORING_DeleteAlarms(record);

    case 'RDS_DeleteDBCluster':
      return [DeleteEvent.RDS_DeleteDBCluster(record)];
    case 'RDS_DeleteDBInstance':
      return [DeleteEvent.RDS_DeleteDBInstance(record)];
    case 'REDSHIFT_DeleteCluster':
      return [DeleteEvent.REDSHIFT_DeleteCluster(record)];

    case 'S3_DeleteBucket':
      return [DeleteEvent.S3_DeleteBucket(record)];

    default:
      return undefined;
  }
};
