import * as CreateEvent from '@src/process/create';
import * as DeleteEvent from '@src/process/delete';
import { CloudTrail, Tables } from 'typings';
import { Consts, DynamodbHelper } from '.';

export const getCreateResourceItem = (record: CloudTrail.Record): Tables.Resource[] | undefined => {
  const { eventName, eventSource } = record;
  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;

  switch (key) {
    case 'APIGATEWAY_CreateApi':
      return [CreateEvent.APIGATEWAY_CreateApi(record)];
    case 'APIGATEWAY_CreateRestApi':
      return [CreateEvent.APIGATEWAY_CreateRestApi(record)];
    case 'APIGATEWAY_ImportRestApi':
      return [CreateEvent.APIGATEWAY_ImportRestApi(record)];
    case 'APIGATEWAY_CreateVpcLink':
      return [CreateEvent.APIGATEWAY_CreateVpcLink(record)];
    case 'AUTOSCALING_CreateAutoScalingGroup':
      return [CreateEvent.AUTOSCALING_CreateAutoScalingGroup(record)];
    case 'APPMESH_CreateMesh':
      return [CreateEvent.APPMESH_CreateMesh(record)];

    case 'BACKUP_CreateBackupVault':
      return [CreateEvent.BACKUP_CreateBackupVault(record)];
    case 'BACKUP_CreateBackupPlan':
      return [CreateEvent.BACKUP_CreateBackupPlan(record)];
    case 'BATCH_CreateComputeEnvironment':
      return [CreateEvent.BATCH_CreateComputeEnvironment(record)];

    case 'CODEBUILD_CreateProject':
      return [CreateEvent.CODEBUILD_CreateProject(record)];
    case 'CONNECT_CreateInstance':
      return [CreateEvent.CONNECT_CreateInstance(record)];
    case 'CLOUDFRONT_CreateDistribution':
      return [CreateEvent.CLOUDFRONT_CreateDistribution(record)];

    case 'DYNAMODB_CreateTable':
      return [CreateEvent.DYNAMODB_CreateTable(record)];
    case 'DS_CreateMicrosoftAD':
      return [CreateEvent.DS_CreateMicrosoftAD(record)];

    case 'EC2_RunInstances':
      return CreateEvent.EC2_RunInstances(record);
    case 'EC2_CreateImage':
      return [CreateEvent.EC2_CreateImage(record)];
    case 'EC2_CreateSnapshot':
      return [CreateEvent.EC2_CreateSnapshot(record)];
    case 'EC2_CreateSnapshots':
      return [CreateEvent.EC2_CreateSnapshots(record)];
    case 'EC2_CreateNatGateway':
      return [CreateEvent.EC2_CreateNatGateway(record)];
    case 'EC2_CreateClientVpnEndpoint':
      return [CreateEvent.EC2_CreateClientVpnEndpoint(record)];
    case 'EC2_CreateVpcPeeringConnection':
      return [CreateEvent.EC2_CreateVpcPeeringConnection(record)];
    case 'EC2_CreateVpc':
      return [CreateEvent.EC2_CreateVpc(record)];
    case 'EC2_CreateVolume':
      return [CreateEvent.EC2_CreateVolume(record)];
    case 'EC2_CreateVpcEndpoint':
      return [CreateEvent.EC2_CreateVpcEndpoint(record)];
    case 'EC2_AllocateAddress':
      return [CreateEvent.EC2_AllocateAddress(record)];
    case 'EC2_CreateCustomerGateway':
      return [CreateEvent.EC2_CreateCustomerGateway(record)];
    case 'EC2_CreateVpnConnection':
      return [CreateEvent.EC2_CreateVpnConnection(record)];
    case 'EC2_CreateVpnGateway':
      return [CreateEvent.EC2_CreateVpnGateway(record)];
    case 'EC2_CreateTransitGateway':
      return [CreateEvent.EC2_CreateTransitGateway(record)];

    case 'ELASTICFILESYSTEM_CreateFileSystem':
      return [CreateEvent.ELASTICFILESYSTEM_CreateFileSystem(record)];

    case 'ELASTICLOADBALANCING_CreateLoadBalancer':
      return [CreateEvent.ELASTICLOADBALANCING_CreateLoadBalancer(record)];
    case 'ELASTICLOADBALANCING_CreateTargetGroup':
      return [CreateEvent.ELASTICLOADBALANCING_CreateTargetGroup(record)];

    case 'EKS_CreateCluster':
      return [CreateEvent.EKS_CreateCluster(record)];
    case 'ES_CreateElasticsearchDomain':
      return [CreateEvent.ES_CreateElasticsearchDomain(record)];

    case 'FIREHOSE_CreateDeliveryStream':
      return [CreateEvent.FIREHOSE_CreateDeliveryStream(record)];

    case 'IAM_CreateAccessKey':
      return [CreateEvent.IAM_CreateAccessKey(record)];
    case 'IAM_CreateRole':
      return [CreateEvent.IAM_CreateRole(record)];
    case 'IAM_CreateSAMLProvider':
      return [CreateEvent.IAM_CreateSAMLProvider(record)];

    case 'KINESIS_CreateStream':
      return [CreateEvent.KINESIS_CreateStream(record)];

    case 'LAMBDA_CreateFunction20150331':
      return [CreateEvent.LAMBDA_CreateFunction20150331(record)];
    case 'LEX_CreateBot':
      return [CreateEvent.LEX_CreateBot(record)];

    case 'MONITORING_PutMetricAlarm':
      return [CreateEvent.MONITORING_PutMetricAlarm(record)];
    case 'MONITORING_PutDashboard':
      return [CreateEvent.MONITORING_PutDashboard(record)];

    case 'RDS_CreateDBCluster':
      return [CreateEvent.RDS_CreateDBCluster(record)];
    case 'RDS_CreateDBInstance':
      return [CreateEvent.RDS_CreateDBInstance(record)];
    case 'REDSHIFT_CreateCluster':
      return [CreateEvent.REDSHIFT_CreateCluster(record)];
    case 'ROUTE53_CreateHostedZone':
      return [CreateEvent.ROUTE53_CreateHostedZone(record)];

    case 'S3_CreateBucket':
      return [CreateEvent.S3_CreateBucket(record)];
    case 'SNS_CreateTopic':
      return [CreateEvent.SNS_CreateTopic(record)];
    case 'SYNTHETICS_CreateCanary':
      return [CreateEvent.SYNTHETICS_CreateCanary(record)];
    case 'STATES_CreateStateMachine':
      return [CreateEvent.STATES_CreateStateMachine(record)];
    case 'SQS_CreateQueue':
      return [CreateEvent.SQS_CreateQueue(record)];

    case 'WAFV2_CreateIPSet':
      return [CreateEvent.WAFV2_CreateIPSet(record)];
    case 'WAFV2_CreateWebACL':
      return [CreateEvent.WAFV2_CreateWebACL(record)];

    default:
      return undefined;
  }
};

export const getRemoveResourceItems = async (record: CloudTrail.Record): Promise<Tables.Resource[] | undefined> => {
  const items = getRemoveResourceItem(record);

  if (!items) return;

  const tasks = items.map((item) =>
    DynamodbHelper.query<Tables.Resource>({
      TableName: Consts.Environments.TABLE_NAME_RESOURCE,
      KeyConditionExpression: 'ResourceId = :ResourceId',
      ExpressionAttributeValues: {
        ':ResourceId': item.ResourceId,
      },
    })
  );

  // get all rows
  const results = await Promise.all(tasks);

  // merge all records
  return results.reduce((prev, curr) => {
    if (curr.Items.length === 0) return prev;

    return [...prev, curr.Items[0]];
  }, [] as Tables.Resource[]);
};

const getRemoveResourceItem = (record: CloudTrail.Record): Tables.ResouceGSI1Key[] | undefined => {
  const { eventName, eventSource } = record;
  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;

  switch (key) {
    case 'APIGATEWAY_DeleteRestApi':
      return [DeleteEvent.APIGATEWAY_DeleteRestApi(record)];
    case 'APIGATEWAY_DeleteVpcLink':
      return [DeleteEvent.APIGATEWAY_DeleteVpcLink(record)];
    case 'AUTOSCALING_DeleteAutoScalingGroup':
      return [DeleteEvent.AUTOSCALING_DeleteAutoScalingGroup(record)];
    case 'APPMESH_DeleteMesh':
      return [DeleteEvent.APPMESH_DeleteMesh(record)];

    case 'BACKUP_DeleteBackupPlan':
      return [DeleteEvent.BACKUP_DeleteBackupPlan(record)];
    case 'BACKUP_DeleteBackupVault':
      return [DeleteEvent.BACKUP_DeleteBackupVault(record)];
    case 'BATCH_DeleteComputeEnvironment':
      return [DeleteEvent.BATCH_DeleteComputeEnvironment(record)];

    case 'CODEBUILD_DeleteProject':
      return [DeleteEvent.CODEBUILD_DeleteProject(record)];
    case 'CLOUDFRONT_DeleteDistribution':
      return [DeleteEvent.CLOUDFRONT_DeleteDistribution(record)];

    case 'DYNAMODB_DeleteTable':
      return [DeleteEvent.DYNAMODB_DeleteTable(record)];
    case 'DS_DeleteDirectory':
      return [DeleteEvent.DS_DeleteDirectory(record)];

    case 'EC2_TerminateInstances':
      return DeleteEvent.EC2_TerminateInstances(record);
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
    case 'EC2_ReleaseAddress':
      return [DeleteEvent.EC2_ReleaseAddress(record)];
    case 'EC2_DeleteCustomerGateway':
      return [DeleteEvent.EC2_DeleteCustomerGateway(record)];
    case 'EC2_DeleteVpnConnection':
      return [DeleteEvent.EC2_DeleteVpnConnection(record)];
    case 'EC2_DeleteVpnGateway':
      return [DeleteEvent.EC2_DeleteVpnGateway(record)];
    case 'EC2_DeleteTransitGateway':
      return [DeleteEvent.EC2_DeleteTransitGateway(record)];

    case 'ELASTICFILESYSTEM_DeleteFileSystem':
      return [DeleteEvent.ELASTICFILESYSTEM_DeleteFileSystem(record)];
    case 'ELASTICLOADBALANCING_DeleteLoadBalancer':
      return [DeleteEvent.ELASTICLOADBALANCING_DeleteLoadBalancer(record)];
    case 'ELASTICLOADBALANCING_DeleteTargetGroup':
      return [DeleteEvent.ELASTICLOADBALANCING_DeleteTargetGroup(record)];
    case 'EKS_DeleteCluster':
      return [DeleteEvent.EKS_DeleteCluster(record)];
    case 'ES_DeleteElasticsearchDomain':
      return [DeleteEvent.ES_DeleteElasticsearchDomain(record)];

    case 'FIREHOSE_DeleteDeliveryStream':
      return [DeleteEvent.FIREHOSE_DeleteDeliveryStream(record)];

    case 'IAM_DeleteAccessKey':
      return [DeleteEvent.IAM_DeleteAccessKey(record)];
    case 'IAM_DeleteRole':
      return [DeleteEvent.IAM_DeleteRole(record)];
    case 'IAM_DeleteSAMLProvider':
      return [DeleteEvent.IAM_DeleteSAMLProvider(record)];
    // case 'IAM_DeleteServiceLinkedRole':
    //   return [DeleteEvent.IAM_DeleteServiceLinkedRole(record)];

    case 'KINESIS_DeleteStream':
      return [DeleteEvent.KINESIS_DeleteStream(record)];

    case 'LAMBDA_DeleteFunction20150331':
      return [DeleteEvent.LAMBDA_DeleteFunction20150331(record)];
    case 'LEX_DeleteBot':
      return [DeleteEvent.LEX_DeleteBot(record)];

    case 'MONITORING_DeleteAlarms':
      return DeleteEvent.MONITORING_DeleteAlarms(record);

    case 'RDS_DeleteDBCluster':
      return [DeleteEvent.RDS_DeleteDBCluster(record)];
    case 'RDS_DeleteDBInstance':
      return [DeleteEvent.RDS_DeleteDBInstance(record)];
    case 'REDSHIFT_DeleteCluster':
      return [DeleteEvent.REDSHIFT_DeleteCluster(record)];
    case 'ROUTE53_DeleteHostedZone':
      return [DeleteEvent.ROUTE53_DeleteHostedZone(record)];

    case 'S3_DeleteBucket':
      return [DeleteEvent.S3_DeleteBucket(record)];
    case 'SNS_DeleteTopic':
      return [DeleteEvent.SNS_DeleteTopic(record)];
    case 'SYNTHETICS_DeleteCanary':
      return [DeleteEvent.SYNTHETICS_DeleteCanary(record)];
    case 'STATES_DeleteStateMachine':
      return [DeleteEvent.STATES_DeleteStateMachine(record)];
    case 'SQS_DeleteQueue':
      return [DeleteEvent.SQS_DeleteQueue(record)];

    case 'WAFV2_DeleteIPSet':
      return [DeleteEvent.WAFV2_DeleteIPSet(record)];
    case 'WAFV2_DeleteWebACL':
      return [DeleteEvent.WAFV2_DeleteWebACL(record)];

    default:
      return undefined;
  }
};
