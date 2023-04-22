import { Consts, ResourceARNs } from '@src/apps/utils';
import { capitalize, defaultTo } from 'lodash';
import { CloudTrail, ResourceInfo, Tables } from 'typings';

const MULTI_TASK = [
  'EC2_RunInstances',
  'EC2_CreateSnapshots',
  'MONITORING_DeleteAlarms',
  'MONITORING_DeleteDashboards',
  'EC2_TerminateInstances',
];

export const start = (record: CloudTrail.Record): Tables.TResource[] => {
  const serviceName = record.eventSource.split('.')[0].toUpperCase();
  const key = `${serviceName}_${record.eventName}`;

  // 登録リソース
  const regists = MULTI_TASK.includes(key) ? getRegistMultiResources(record) : getRegistSingleResource(record);
  // 削除リソース
  const removes = MULTI_TASK.includes(key) ? getRemoveMultiResources(record) : [getRemoveSingleResource(record)];
  // 全部リソース
  const resources = [
    ...regists,
    ...removes.filter((item): item is Exclude<typeof item, undefined> => item !== undefined),
  ];

  return resources.map((item) => ({
    UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
    ResourceId: item.id,
    ResourceName: item.name,
    EventName: record.eventName,
    EventSource: record.eventSource,
    EventTime: record.eventTime,
    AWSRegion: record.awsRegion,
    IdentityType: record.userIdentity.type,
    UserAgent: record.userAgent,
    EventId: record.eventID,
    Service: getServiceName(serviceName),
    Revisions: [],
    Status: regists.length > 0 ? Consts.ResourceStatus.CREATED : Consts.ResourceStatus.DELETED,
  }));
};

const getRegistSingleResource = (record: CloudTrail.Record): ResourceInfo[] => {
  const {
    awsRegion: region,
    recipientAccountId: account,
    responseElements: response,
    requestParameters: request,
    eventSource,
    eventName,
  } = record;
  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;
  let name = '';
  let rets: string[] = [];

  switch (key) {
    case 'APIGATEWAY_CreateApi':
      rets = [ResourceARNs.APIGATEWAY_Api(region, account, response.apiId), response.name];
      break;

    case 'APIGATEWAY_CreateRestApi':
      rets = [ResourceARNs.APIGATEWAY_Api(region, account, response.id), response.name];
      break;

    case 'APIGATEWAY_CreateVpcLink':
      // 存在しない場合は、処理不要
      if (!response.vpcLinkId) {
        break;
      }

      rets = [ResourceARNs.APIGATEWAY_VpcLink(region, account, response.vpcLinkId), response.name];

      break;

    case 'APIGATEWAY_ImportRestApi':
      rets = [ResourceARNs.APIGATEWAY_Api(region, account, response.id), response.name];
      break;

    case 'APIGATEWAY_CreateDomainName':
      name = response.domainName;
      rets = [ResourceARNs.APIGATEWAY_DomainName(region, account, name), name];
      break;

    case 'APPMESH_CreateMesh':
      rets = [response.mesh.metadata.arn, response.mesh.meshName];
      break;

    case 'AUTOSCALING_CreateAutoScalingGroup':
      name = request.autoScalingGroupName;
      rets = [ResourceARNs.AUTOSCALING_AutoScalingGroup(region, account, name), name];
      break;

    case 'BATCH_CreateComputeEnvironment':
      rets = [response.computeEnvironmentArn, response.computeEnvironmentName];
      break;

    case 'BACKUP_CreateBackupPlan':
      rets = [response.backupPlanArn, response.backupPlanId];
      break;

    case 'BACKUP_CreateBackupVault':
      rets = [response.backupVaultArn, response.backupVaultName];
      break;

    case 'CONNECT_CreateInstance':
      rets = [response.Arn, request.InstanceAlias];
      break;

    case 'CODEDEPLOY_CreateApplication':
      name = request.applicationName;
      rets = [ResourceARNs.CODEDEPLOY_Application(region, account, name), name];
      break;

    case 'CODEBUILD_CreateProject':
      rets = [response.project.arn, response.project.name];
      break;

    case 'CLOUDFORMATION_CreateStack':
      rets = [response.stackId, request.stackName];
      break;

    case 'CLOUDFRONT_CreateDistribution':
      rets = [response.distribution.aRN, response.distribution.domainName];
      break;

    case 'COGNITO-IDP_CreateUserPool':
      rets = [response.userPool.arn, response.userPool.name];
      break;

    case 'COGNITO-IDENTITY_CreateIdentityPool':
      rets = [ResourceARNs.COGNITO_IDENTITYPOOL(region, account, response.identityPoolId), response.identityPoolName];
      break;

    case 'DYNAMODB_CreateTable':
      rets = [response.tableDescription.tableArn, response.tableDescription.tableName];
      break;

    case 'DS_CreateDirectory':
    case 'DS_CreateMicrosoftAD':
    case 'DS_CreateIdentityPoolDirectory':
    case 'DS_ConnectDirectory':
      rets = [ResourceARNs.DS_Directory(region, account, response.directoryId), request.name];
      break;

    case 'DMS_CreateReplicationInstance':
      rets = [
        response.replicationInstance.replicationInstanceArn,
        response.replicationInstance.replicationInstanceIdentifier,
      ];
      break;

    case 'ES_CreateElasticsearchDomain':
      rets = [response.domainStatus.aRN, response.domainStatus.domainName];
      break;

    case 'ELASTICFILESYSTEM_CreateFileSystem':
      rets = [ResourceARNs.ELASTICFILESYSTEM_FileSystem(region, account, response.fileSystemId), response.name];
      break;

    case 'EKS_CreateCluster':
      rets = [response.cluster.arn, response.cluster.name];
      break;

    case 'ECS_CreateCluster':
      rets = [response.cluster.clusterArn, response.cluster.clusterName];
      break;

    case 'ECR_CreateRepository':
      rets = [response.repository.repositoryArn, response.repository.repositoryName];
      break;

    case 'EC2_CreateClientVpnEndpoint':
      rets = [
        ResourceARNs.EC2_ClientVpnEndpoint(
          region,
          account,
          response.CreateClientVpnEndpointResponse.clientVpnEndpointId
        ),
        response.CreateClientVpnEndpointResponse.dnsName,
      ];
      break;

    case 'EC2_CreateCustomerGateway':
      name = response.customerGateway.customerGatewayId;
      rets = [ResourceARNs.EC2_CustomerGateway(region, account, name), name];
      break;

    case 'EC2_CreateInternetGateway':
      name = response.internetGateway.internetGatewayId;
      rets = [ResourceARNs.EC2_InternetGateway(region, account, name), name];
      break;

    case 'EC2_CreateLaunchTemplate':
      name = response.CreateLaunchTemplateResponse.launchTemplate.launchTemplateId;
      rets = [ResourceARNs.EC2_LaunchTemplate(region, account, name), name];
      break;

    case 'EC2_CreateNatGateway':
      name = response.CreateNatGatewayResponse.natGateway.natGatewayId;
      rets = [ResourceARNs.EC2_NatGateway(region, account, name), name];
      break;

    case 'EC2_CreateNetworkInsightsPath':
      name = response.CreateNetworkInsightsPathResponse.networkInsightsPath.networkInsightsPathId;
      rets = [ResourceARNs.EC2_NetworkInsightsPath(region, account, name), name];
      break;

    case 'EC2_CopySnapshot':
    case 'EC2_CreateSnapshot':
      name = response.snapshotId;
      rets = [ResourceARNs.EC2_Snapshot(region, account, name), name];
      break;

    case 'EC2_RestoreSnapshotFromRecycleBin':
      name = response.RestoreSnapshotFromRecycleBinResponse.snapshotId;
      rets = [ResourceARNs.EC2_Snapshot(region, account, name), name];
      break;

    case 'EC2_CreateSubnet':
      name = response.subnet.subnetId;
      rets = [ResourceARNs.EC2_Subnet(region, account, name), name];
      break;

    case 'EC2_CreateTransitGateway':
      rets = [response.CreateTransitGatewayResponse.transitGateway.transitGatewayArn, response.publicIp];
      break;

    case 'EC2_CreateVolume':
      name = response.volumeId;
      rets = [ResourceARNs.EC2_Volume(region, account, name), name];
      break;

    case 'EC2_CreateVpc':
      name = response.vpc.vpcId;
      rets = [ResourceARNs.EC2_Vpc(region, account, name), name];
      break;

    case 'EC2_CreateVpcEndpoint':
      name = response.CreateVpcEndpointResponse.vpcEndpoint.vpcEndpointId;
      rets = [ResourceARNs.EC2_VpcEndpoints(region, account, name), name];
      break;

    case 'EC2_CreateVpcPeeringConnection':
      name = response.vpcPeeringConnection.vpcPeeringConnectionId;
      rets = [ResourceARNs.EC2_VpcPeeringConnection(region, account, name), name];
      break;

    case 'EC2_CreateVpnConnection':
      name = response.vpnConnection.vpnConnectionId;
      rets = [ResourceARNs.EC2_VpnConnection(region, account, name), name];
      break;

    case 'EC2_CreateVpnGateway':
      name = response.vpnGateway.vpnGatewayId;
      rets = [ResourceARNs.EC2_VpnGateway(region, account, name), name];
      break;

    case 'EC2_CreateImage':
      rets = [ResourceARNs.EC2_Image(region, account, response.imageId), request.name];
      break;

    case 'EC2_AllocateAddress':
      rets = [ResourceARNs.EC2_IPAddress(region, account, response.allocationId), response.publicIp];
      break;

    case 'EC2_CreateSecurityGroup':
      rets = [ResourceARNs.EC2_SecurityGroup(region, account, response.groupId), request.groupName];
      break;

    case 'ELASTICACHE_CreateCacheCluster':
      rets = [response.aRN, response.cacheClusterId];
      break;

    case 'ELASTICACHE_CreateCacheSubnetGroup':
      rets = [response.aRN, response.cacheSubnetGroupName];
      break;

    case 'ELASTICLOADBALANCING_CreateLoadBalancer':
      rets = [response.loadBalancers[0].loadBalancerArn, response.loadBalancers[0].loadBalancerName];
      break;

    case 'ELASTICLOADBALANCING_CreateTargetGroup':
      rets = [response.targetGroups[0].targetGroupArn, response.targetGroups[0].targetGroupName];

      break;

    case 'FIREHOSE_CreateDeliveryStream':
      rets = [response.deliveryStreamARN, request.deliveryStreamName];
      break;

    case 'FSX_CreateFileSystem':
      rets = [response.fileSystem.resourceARN, response.fileSystem.fileSystemId];
      break;

    case 'GLUE_CreateDatabase':
      name = request.databaseInput.name;
      rets = [ResourceARNs.GLUE_Database(region, account, name), name];
      break;

    case 'IOT_CreateTopicRule':
      name = request.ruleName;
      rets = [ResourceARNs.IOT_TopicRule(region, account, name), name];
      break;

    case 'KINESIS_CreateStream':
      name = request.streamName;
      rets = [ResourceARNs.KINESIS_Stream(region, account, name), name];
      break;

    case 'KINESISANALYTICS_CreateApplication':
      rets = [response.applicationSummary.applicationARN, response.applicationSummary.applicationName];
      break;

    case 'LOGS_CreateLogGroup':
      name = request.logGroupName;
      rets = [ResourceARNs.LOGS_LogGroup(region, account, name), name];
      break;

    case 'LEX_CreateBot':
      name = response.botName;
      rets = [ResourceARNs.LEX_Bot(region, account, name), name];
      break;

    case 'LAMBDA_CreateFunction20150331':
      rets = [response.functionArn, response.functionName];
      break;

    case 'NETWORK-FIREWALL_CreateFirewall':
      rets = [response.firewall.firewallArn, response.firewall.firewallName];
      break;

    case 'REDSHIFT_CreateCluster':
      name = response.clusterIdentifier;
      rets = [ResourceARNs.REDSHIFT_Cluster(region, account, name), name];
      break;

    case 'ROUTE53_CreateHostedZone':
      rets = [
        ResourceARNs.ROUTE53_HostedZone(region, account, (response.hostedZone.id as string).split('/')[2]),
        response.hostedZone.name,
      ];
      break;

    case 'RDS_CreateDBCluster':
    case 'RDS_RestoreDBClusterToPointInTime':
    case 'RDS_RestoreDBClusterFromSnapshot':
      rets = [response.dBClusterArn, response.dBClusterIdentifier];
      break;

    case 'RDS_CreateDBClusterParameterGroup':
      rets = [response.dBClusterParameterGroupArn, response.dBClusterParameterGroupName];
      break;

    case 'RDS_CreateDBInstance':
    case 'RDS_RestoreDBInstanceToPointInTime':
    case 'RDS_RestoreDBInstanceFromDBSnapshot':
      rets = [response.dBInstanceArn, response.dBInstanceIdentifier];
      break;

    case 'RDS_CreateDBParameterGroup':
      rets = [response.dBParameterGroupArn, response.dBParameterGroupName];
      break;

    case 'RDS_CreateDBProxy':
      rets = [response.dBProxy.dBProxyArn, response.dBProxy.dBProxyName];
      break;

    case 'RDS_CreateDBSnapshot':
      rets = [response.dBSnapshotArn, response.dBSnapshotIdentifier];
      break;

    case 'RDS_CopyDBSnapshot':
      rets = [response.dBSnapshotArn, response.dBSnapshotIdentifier];
      break;

    case 'RDS_CreateDBSubnetGroup':
      rets = [response.dBSubnetGroupArn, response.dBSubnetGroupName];
      break;

    case 'RDS_CreateDBClusterSnapshot':
      rets = [response.dBClusterSnapshotArn, response.dBClusterSnapshotIdentifier];
      break;

    case 'RDS_RestoreDBClusterToPointInTime':
      rets = [response.dBClusterArn, response.dBClusterIdentifier];
      break;

    case 'RDS_CreateOptionGroup':
      rets = [response.optionGroupArn, response.optionGroupName];
      break;

    // case 'SERVICEDISCOVERY_CreatePrivateDnsNamespace':
    //   name = request.name;
    //   rets = [ResourceARNs.SERVICEDISCOVERY_Namespace(region, account, name), name];
    case 'SERVERLESSREPO_CreateApplication':
      rets = [response.applicationId, response.name];
      break;

    case 'S3_CreateBucket':
      name = request.bucketName;
      rets = [ResourceARNs.S3_Bucket(region, account, name), name];
      break;

    case 'SNS_CreateTopic':
      rets = [response.topicArn, request.name];
      break;

    case 'SQS_CreateQueue':
      name = request.queueName;
      rets = [ResourceARNs.SQS_Queue(region, account, name), name];
      break;

    case 'STATES_CreateStateMachine':
      rets = [response.stateMachineArn, request.name];
      break;

    case 'SYNTHETICS_CreateCanary':
      name = response.Canary.Name;
      rets = [ResourceARNs.SYNTHETICS_Canary(region, account, name), name];
      break;

    case 'TIMESTREAM_CreateDatabase':
      rets = [response.database.arn, response.database.databaseName];
      break;

    case 'TRANSFER_CreateServer':
      name = response.serverId;
      rets = [ResourceARNs.TRANSFER_Server(region, account, name), name];
      break;

    case 'WAFV2_CreateIPSet':
      rets = [response.summary.aRN, response.summary.name];
      break;

    case 'WAFV2_CreateWebACL':
      rets = [response.summary.aRN, response.summary.name];
      break;

    case 'IAM_CreateAccessKey':
      rets = [response.accessKey.accessKeyId, response.accessKey.userName];
      break;

    case 'IAM_CreateRole':
      rets = [response.role.arn, response.role.roleName];
      break;

    case 'IAM_CreateSAMLProvider':
      rets = [response.sAMLProviderArn, request.name];
      break;

    case 'EVENTS_PutRule':
      rets = [response.ruleArn, request.name];
      break;

    case 'EVENTS_DeleteRule':
      name = request.name;
      rets = [ResourceARNs.EVENTS_Rule(region, account, name), name];
      break;

    case 'MONITORING_PutDashboard':
      name = request.dashboardName;
      rets = [ResourceARNs.MONITORING_Dashboard(region, account, name), name];
      break;

    case 'MONITORING_PutMetricAlarm':
      name = request.alarmName;
      rets = [ResourceARNs.MONITORING_Alarm(region, account, name), name];
      break;
  }

  // イベント対象外
  if (rets.length === 0) return [];

  return [
    {
      id: rets[0],
      name: rets[1],
    },
  ];
};

const getRegistMultiResources = (record: CloudTrail.Record): ResourceInfo[] => {
  const {
    awsRegion: region,
    recipientAccountId: account,
    responseElements: response,
    requestParameters: request,
    eventSource,
    eventName,
  } = record;
  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;

  switch (key) {
    case 'EC2_RunInstances':
      return (response.instancesSet.items as any[]).map<ResourceInfo>((item: { instanceId: any }) => ({
        id: ResourceARNs.EC2_Instances(region, account, item.instanceId),
        name: item.instanceId,
      }));

    case 'EC2_CreateSnapshots':
      const items = response.CreateSnapshotsResponse.snapshotSet.item;

      if (Array.isArray(items)) {
        return items.map<ResourceInfo>((item) => ({
          id: ResourceARNs.EC2_Snapshot(region, account, item.snapshotId),
          name: item.snapshotId,
        }));
      }

      const snapshotId = items.snapshotId;
      return [
        {
          id: ResourceARNs.EC2_Snapshot(region, account, snapshotId),
          name: snapshotId,
        },
      ];

    case 'MONITORING_DeleteAlarms':
      return (request.alarmNames as string[]).map<ResourceInfo>((item) => ({
        id: ResourceARNs.MONITORING_Alarm(region, account, item),
        name: item,
      }));

    case 'MONITORING_DeleteDashboards':
      return (request.dashboardNames as string[]).map((item) => ({
        id: ResourceARNs.MONITORING_Dashboard(region, account, item),
        name: item,
      }));
  }

  return [];
};

const getRemoveSingleResource = (record: CloudTrail.Record): ResourceInfo | undefined => {
  const {
    awsRegion: region,
    recipientAccountId: account,
    responseElements: response,
    requestParameters: request,
    eventSource,
    eventName,
  } = record;
  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;
  let arn = undefined;

  switch (key) {
    case 'APIGATEWAY_DeleteApi':
      arn = ResourceARNs.APIGATEWAY_Api(region, account, request.apiId);
      break;

    case 'APIGATEWAY_DeleteRestApi':
      arn = ResourceARNs.APIGATEWAY_Api(region, account, request.restApiId);
      break;

    case 'APIGATEWAY_DeleteVpcLink':
      arn = ResourceARNs.APIGATEWAY_VpcLink(region, account, request.vpcLinkId);
      break;

    case 'APIGATEWAY_DeleteDomainName':
      arn = ResourceARNs.APIGATEWAY_DomainName(region, account, request.domainName);
      break;

    case 'APPMESH_DeleteMesh':
      arn = response.mesh.metadata.arn;
      break;

    case 'AUTOSCALING_DeleteAutoScalingGroup':
      arn = ResourceARNs.AUTOSCALING_AutoScalingGroup(region, account, request.autoScalingGroupName);
      break;

    case 'BATCH_DeleteComputeEnvironment':
      arn = request.computeEnvironment;
      break;

    case 'CONNECT_DeleteInstance':
      arn = decodeURIComponent(request.InstanceId);
      break;

    case 'CODEDEPLOY_DeleteApplication':
      arn = ResourceARNs.CODEDEPLOY_Application(region, account, request.applicationName);
      break;

    case 'CODEBUILD_DeleteProject':
      arn = request.name;
      break;

    case 'CLOUDFORMATION_DeleteStack':
      const stackName = request.stackName as string;

      // ARN ではない場合、処理スキップする
      if (!stackName.startsWith('arn')) {
        break;
      }

      arn = stackName;
      break;

    case 'CLOUDFRONT_DeleteDistribution':
      arn = ResourceARNs.CLOUDFRONT_Distribution(region, account, request.id);
      break;

    case 'DYNAMODB_DeleteTable':
      arn = response.tableDescription.tableArn;
      break;

    case 'DS_DeleteDirectory':
      arn = ResourceARNs.DS_Directory(region, account, response.directoryId);
      break;

    case 'DMS_DeleteReplicationInstance':
      arn = response.replicationInstance.replicationInstanceArn;
      break;

    case 'ES_DeleteElasticsearchDomain':
      arn = response.domainStatus.aRN;
      break;

    case 'ELASTICFILESYSTEM_DeleteFileSystem':
      arn = ResourceARNs.ELASTICFILESYSTEM_FileSystem(region, account, request.fileSystemId);
      break;

    case 'EKS_DeleteCluster':
      arn = response.cluster.arn;
      break;

    case 'ECS_DeleteCluster':
      arn = response.cluster.clusterArn;
      break;

    case 'ECR_DeleteRepository':
      arn = response.repository.repositoryArn;
      break;

    case 'FIREHOSE_DeleteDeliveryStream':
      arn = ResourceARNs.FIREHOSE_DeliveryStream(region, account, request.deliveryStreamName);
      break;

    case 'FSX_DeleteFileSystem':
      arn = ResourceARNs.FSX_FileSystem(region, account, request.fileSystemId);
      break;

    case 'GLUE_DeleteDatabase':
      arn = ResourceARNs.GLUE_Database(region, account, request.name);
      break;

    case 'IOT_DeleteTopicRule':
      arn = ResourceARNs.IOT_TopicRule(region, account, request.ruleName);
      break;

    case 'KINESIS_DeleteStream':
      arn = ResourceARNs.KINESIS_Stream(region, account, request.streamName);
      break;

    case 'KINESISANALYTICS_DeleteApplication':
      arn = ResourceARNs.KINESISANALYTICS_Application(region, account, request.applicationName);
      break;

    case 'LOGS_DeleteLogGroup':
      arn = ResourceARNs.LOGS_LogGroup(region, account, request.logGroupName);
      break;

    case 'LEX_DeleteBot':
      if (!request.name) {
        break;
      }
      arn = ResourceARNs.LEX_Bot(region, account, request.name);
      break;

    case 'LAMBDA_DeleteFunction20150331':
      arn = ResourceARNs.LAMBDA_Function20150331(region, account, request.functionName);
      break;

    case 'NETWORK-FIREWALL_DeleteFirewall':
      arn = response.firewall.firewallArn;
      break;

    case 'REDSHIFT_DeleteCluster':
      arn = ResourceARNs.REDSHIFT_Cluster(region, account, response.clusterIdentifier);
      break;

    case 'ROUTE53_DeleteHostedZone':
      arn = ResourceARNs.ROUTE53_HostedZone(region, account, request.id);
      break;

    case 'RDS_DeleteDBCluster':
      arn = response.dBClusterArn;
      break;

    case 'RDS_DeleteDBClusterParameterGroup':
      arn = ResourceARNs.RDS_DBClusterParameterGroup(region, account, request.dBClusterParameterGroupName);
      break;

    case 'RDS_DeleteDBInstance':
      arn = response.dBInstanceArn;
      break;

    case 'RDS_DeleteDBParameterGroup':
      arn = ResourceARNs.RDS_DBParameterGroup(region, account, request.dBParameterGroupName);
      break;

    case 'RDS_DeleteDBProxy':
      arn = response.dBProxy.dBProxyArn;
      break;

    case 'RDS_DeleteDBSnapshot':
      arn = response.dBSnapshotArn;
      break;

    case 'RDS_DeleteDBSubnetGroup':
      arn = ResourceARNs.RDS_DBSubnetGroup(region, account, request.dBSubnetGroupName);
      break;

    case 'RDS_DeleteOptionGroup':
      arn = ResourceARNs.RDS_DBOptionGroup(region, account, request.optionGroupName);
      break;

    case 'S3_DeleteBucket':
      arn = ResourceARNs.S3_Bucket(region, account, request.bucketName);
      break;

    case 'SNS_DeleteTopic':
      arn = request.topicArn;
      break;

    case 'SQS_DeleteQueue':
      const queueUrl: string = request.queueUrl;
      const queueName = queueUrl.split('/')[queueUrl.split('/').length - 1];
      arn = ResourceARNs.SQS_Queue(region, account, queueName);
      break;

    case 'STATES_DeleteStateMachine':
      arn = request.stateMachineArn;
      break;

    case 'SYNTHETICS_DeleteCanary':
      arn = ResourceARNs.SYNTHETICS_Canary(region, account, request.name);
      break;

    case 'TIMESTREAM_DeleteDatabase':
      arn = ResourceARNs.TIMESTREAM_Database(region, account, request.databaseName);
      break;

    case 'TRANSFER_DeleteServer':
      arn = ResourceARNs.TRANSFER_Server(region, account, request.serverId);
      break;

    case 'WAFV2_DeleteIPSet':
      arn = ResourceARNs.WAFV2_IPSet(
        region,
        account,
        `${(request.scope as string).toLowerCase()}/ipset/${request.name}/${request.id}`
      );
      break;

    case 'WAFV2_DeleteWebACL':
      arn = ResourceARNs.WAFV2_WebACL(
        region,
        account,
        `${(request.scope as string).toLowerCase()}/webacl/${request.name}/${request.id}`
      );
      break;

    case 'ELASTICACHE_DeleteCacheCluster':
      arn = response.aRN;
      break;

    case 'ELASTICACHE_DeleteCacheSubnetGroup':
      arn = ResourceARNs.ELASTICACHE_CacheSubnetGroup(region, account, request.cacheSubnetGroupName);
      break;

    case 'ELASTICLOADBALANCING_DeleteLoadBalancer':
      arn = request.loadBalancerArn;
      break;

    case 'ELASTICLOADBALANCING_DeleteTargetGroup':
      arn = request.targetGroupArn;
      break;

    case 'IAM_DeleteAccessKey':
      arn = request.accessKeyId;
      break;

    case 'IAM_DeleteRole':
      arn = ResourceARNs.IAM_Role(region, account, request.roleName);
      break;

    case 'IAM_DeleteSAMLProvider':
      arn = request.sAMLProviderArn;
      break;

    case 'IAM_DeleteServiceLinkedRole':
      arn = ResourceARNs.IAM_Role(region, account, request.roleName);
      break;

    case 'EC2_DeleteClientVpnEndpoint':
      arn = ResourceARNs.EC2_ClientVpnEndpoint(
        region,
        account,
        request.DeleteClientVpnEndpointRequest.ClientVpnEndpointId
      );
      break;

    case 'EC2_DeleteCustomerGateway':
      arn = ResourceARNs.EC2_CustomerGateway(region, account, request.customerGatewayId);
      break;

    case 'EC2_DeleteInternetGateway':
      arn = ResourceARNs.EC2_InternetGateway(region, account, request.internetGatewayId);
      break;

    case 'EC2_DeleteLaunchTemplate':
      arn = ResourceARNs.EC2_LaunchTemplate(region, account, request.DeleteLaunchTemplateRequest.LaunchTemplateId);
      break;

    case 'EC2_DeleteNatGateway':
      arn = ResourceARNs.EC2_NatGateway(region, account, response.DeleteNatGatewayResponse.natGatewayId);
      break;

    case 'EC2_DeleteNetworkInsightsPath':
      arn = ResourceARNs.EC2_NetworkInsightsPath(
        region,
        account,
        response.DeleteNetworkInsightsPathResponse.networkInsightsPathId
      );
      break;

    case 'EC2_DeleteSnapshot':
      arn = ResourceARNs.EC2_Snapshot(region, account, request.snapshotId);
      break;

    case 'EC2_DeleteSubnet':
      arn = ResourceARNs.EC2_Subnet(region, account, request.subnetId);
      break;

    case 'EC2_DeleteTransitGateway':
      arn = ResourceARNs.EC2_TransitGateway(region, account, request.DeleteTransitGatewayRequest.TransitGatewayId);
      break;

    case 'EC2_DeleteVolume':
      arn = ResourceARNs.EC2_Volume(region, account, request.volumeId);
      break;

    case 'EC2_DeleteVpc':
      arn = ResourceARNs.EC2_Vpc(region, account, request.vpcId);
      break;

    case 'EC2_DeleteVpcEndpoints':
      arn = ResourceARNs.EC2_VpcEndpoints(region, account, request.DeleteVpcEndpointsRequest.VpcEndpointId.content);
      break;

    case 'EC2_DeleteVpcPeeringConnection':
      arn = ResourceARNs.EC2_VpcPeeringConnection(region, account, request.vpcPeeringConnectionId);
      break;

    case 'EC2_DeleteVpnConnection':
      arn = ResourceARNs.EC2_VpnConnection(region, account, request.vpnConnectionId);
      break;

    case 'EC2_DeleteVpnGateway':
      arn = ResourceARNs.EC2_VpnGateway(region, account, request.vpnGatewayId);
      break;

    case 'EC2_DeregisterImage':
      arn = ResourceARNs.EC2_Image(region, account, request.imageId);
      break;

    case 'EC2_ReleaseAddress':
      arn = ResourceARNs.EC2_IPAddress(region, account, request.allocationId);
      break;

    case 'EC2_DeleteSecurityGroup':
      const groupId = request.groupId;

      // グループID 存在しない場合、既存リソースから
      if (!groupId) {
        break;
      }

      arn = ResourceARNs.EC2_SecurityGroup(region, account, groupId);
      break;

    case 'BACKUP_DeleteBackupPlan':
      arn = response.backupPlanArn;
      break;

    case 'BACKUP_DeleteBackupVault':
      arn = ResourceARNs.BACKUP_BackupVault(region, account, request.backupVaultName);
      break;
  }

  // 未対応のリソース
  if (!arn) return;

  return {
    id: arn,
  };
};

const getRemoveMultiResources = (record: CloudTrail.Record): ResourceInfo[] => {
  const { awsRegion: region, recipientAccountId: account, responseElements: response, eventSource, eventName } = record;
  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;

  switch (key) {
    case 'EC2_TerminateInstances':
      return (response.instancesSet.items as any[]).map<ResourceInfo>(
        (item: { instanceId: string; currentState: { code: number }; previousState: { code: number } }) => ({
          id: ResourceARNs.EC2_Instances(region, account, item.instanceId),
        })
      );
  }

  return [];
};

const UPPERCASE = ['EC2', 'RDS', 'IAM', 'SNS', 'SQS', 'ECS', 'ECR', 'EKS', 'DMS'];

const getServiceName = (serviceName: string) => {
  if (UPPERCASE.includes(serviceName)) return serviceName;

  if (serviceName === 'STATES') return 'StepFunction';
  if (serviceName === 'LOGS') return 'CloudWatchLogs';
  if (serviceName === 'ES') return 'Elasticsearch';
  if (serviceName === 'DS') return 'DirectoryService';

  return capitalize(serviceName);
};
