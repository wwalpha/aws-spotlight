import * as CreateEvent from '@src/process/create';
import * as RemoveService from '@src/process/RemoveService';

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

    case 'BATCH_CreateComputeEnvironment':
      return [CreateEvent.BATCH_CreateComputeEnvironment(record)];

    case 'CODEBUILD_CreateProject':
      return [CreateEvent.CODEBUILD_CreateProject(record)];
    case 'CODEDEPLOY_CreateApplication':
      return [CreateEvent.CODEDEPLOY_CreateApplication(record)];
    case 'CONNECT_CreateInstance':
      return [CreateEvent.CONNECT_CreateInstance(record)];
    case 'CLOUDFRONT_CreateDistribution':
      return [CreateEvent.CLOUDFRONT_CreateDistribution(record)];
    case 'CLOUDFORMATION_CreateStack':
      return [CreateEvent.CLOUDFORMATION_CreateStack(record)];

    case 'DYNAMODB_CreateTable':
      return [CreateEvent.DYNAMODB_CreateTable(record)];
    case 'DS_CreateMicrosoftAD':
      return [CreateEvent.DS_CreateMicrosoftAD(record)];
    case 'DMS_CreateReplicationInstance':
      return [CreateEvent.DMS_CreateReplicationInstance(record)];

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
    case 'EC2_CreateSubnet':
      return [CreateEvent.EC2_CreateSubnet(record)];
    case 'EC2_CreateSecurityGroup':
      return [CreateEvent.EC2_CreateSecurityGroup(record)];
    case 'EC2_CreateInternetGateway':
      return [CreateEvent.EC2_CreateInternetGateway(record)];
    case 'EC2_CreateNetworkInsightsPath':
      return [CreateEvent.EC2_CreateNetworkInsightsPath(record)];
    case 'EC2_CreateLaunchTemplate':
      return [CreateEvent.EC2_CreateLaunchTemplate(record)];

    case 'ECR_CreateRepository':
      return [CreateEvent.ECR_CreateRepository(record)];
    case 'ECS_CreateCluster':
      return [CreateEvent.ECS_CreateCluster(record)];
    case 'EVENTS_PutRule':
      return [CreateEvent.EVENTS_PutRule(record)];

    case 'ELASTICFILESYSTEM_CreateFileSystem':
      return [CreateEvent.ELASTICFILESYSTEM_CreateFileSystem(record)];
    case 'ELASTICACHE_CreateCacheCluster':
      return [CreateEvent.ELASTICACHE_CreateCacheCluster(record)];
    case 'ELASTICACHE_CreateCacheSubnetGroup':
      return [CreateEvent.ELASTICACHE_CreateCacheSubnetGroup(record)];

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

    case 'GLUE_CreateDatabase':
      return [CreateEvent.GLUE_CreateDatabase(record)];

    case 'IAM_CreateAccessKey':
      return [CreateEvent.IAM_CreateAccessKey(record)];
    case 'IAM_CreateRole':
      return [CreateEvent.IAM_CreateRole(record)];
    case 'IAM_CreateSAMLProvider':
      return [CreateEvent.IAM_CreateSAMLProvider(record)];
    case 'IOT_CreateTopicRule':
      return [CreateEvent.IOT_CreateTopicRule(record)];

    case 'KINESIS_CreateStream':
      return [CreateEvent.KINESIS_CreateStream(record)];

    case 'LAMBDA_CreateFunction20150331':
      return [CreateEvent.LAMBDA_CreateFunction20150331(record)];
    case 'LEX_CreateBot':
      return [CreateEvent.LEX_CreateBot(record)];
    case 'LOGS_CreateLogGroup':
      return [CreateEvent.LOGS_CreateLogGroup(record)];

    case 'MONITORING_PutMetricAlarm':
      return [CreateEvent.MONITORING_PutMetricAlarm(record)];
    case 'MONITORING_PutDashboard':
      return [CreateEvent.MONITORING_PutDashboard(record)];

    case 'NETWORK-FIREWALL_CreateFirewall':
      return [CreateEvent.NFW_CreateFirewall(record)];

    case 'RDS_CreateDBCluster':
      return [CreateEvent.RDS_CreateDBCluster(record)];
    case 'RDS_CreateDBInstance':
      return [CreateEvent.RDS_CreateDBInstance(record)];
    case 'RDS_CreateDBProxy':
      return [CreateEvent.RDS_CreateDBProxy(record)];
    case 'RDS_CreateDBClusterParameterGroup':
      return [CreateEvent.RDS_CreateDBClusterParameterGroup(record)];
    case 'RDS_CreateDBParameterGroup':
      return [CreateEvent.RDS_CreateDBParameterGroup(record)];
    case 'RDS_CreateDBSubnetGroup':
      return [CreateEvent.RDS_CreateDBSubnetGroup(record)];
    // case 'RDS_CreateDBSnapshot':
    //   return [CreateEvent.RDS_CreateDBSnapshot(record)];
    // case 'RDS_CopyDBSnapshot':
    //   return [CreateEvent.RDS_CopyDBSnapshot(record)];

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

    case 'TRANSFER_CreateServer':
      return [CreateEvent.TRANSFER_CreateServer(record)];
    case 'TIMESTREAM_CreateDatabase':
      return [CreateEvent.TIMESTREAM_CreateDatabase(record)];

    case 'WAFV2_CreateIPSet':
      return [CreateEvent.WAFV2_CreateIPSet(record)];
    case 'WAFV2_CreateWebACL':
      return [CreateEvent.WAFV2_CreateWebACL(record)];

    default:
      return undefined;
  }
};

export const getRemoveResourceItems = async (record: CloudTrail.Record): Promise<Tables.Resource[] | undefined> => {
  const items = RemoveService.start(record);

  if (!items) return;

  const tasks = items.map((item) =>
    DynamodbHelper.query<Tables.Resource>({
      TableName: Consts.Environments.TABLE_NAME_RESOURCES,
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
