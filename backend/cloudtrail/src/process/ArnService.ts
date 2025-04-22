import { Consts, Logger, ResourceARNs } from '@src/apps/utils';
import { capitalize, defaultTo, isEmpty } from 'lodash';
import { CloudTrailRecord, ResourceInfo, Tables } from 'typings';
import { ResourceService } from '@src/services';
import { getUserName } from './utils';

const MULTI_TASK = [
  'EC2_RunInstances',
  'EC2_CreateFleet',
  'EC2_CreateSnapshots',
  'EC2_TerminateInstances',
  'EC2_DeleteVpcEndpoints',
  'MONITORING_DeleteAlarms',
  'MONITORING_DeleteDashboards',
];

const UPPERCASE = ['EC2', 'RDS', 'IAM', 'SNS', 'SQS', 'ECS', 'ECR', 'EKS', 'DMS'];

export const start = async (record: CloudTrailRecord): Promise<Tables.TResource[]> => {
  const serviceName = record.eventSource.split('.')[0].toUpperCase();
  const key = `${serviceName}_${record.eventName}`;

  // 除外対象
  if (isExcludeRecord(record) === true) {
    return [];
  }

  try {
    // 登録リソース
    const regists = MULTI_TASK.includes(key) ? getRegistMultiResources(record) : getRegistSingleResource(record);
    // 削除リソース
    const removes = MULTI_TASK.includes(key) ? getRemoveMultiResources(record) : await getRemoveSingleResource(record);
    // 全部リソース
    const resources = [...regists, ...removes];

    if (resources.length === 0) {
      if (!MULTI_TASK.includes(key)) {
        console.error(`Cannot found process logic. EventId: ${key}`);
      }
    }

    // ユーザ名取得
    const userName = await getUserName(record);

    // 除外対象
    if (isExcludeUser(userName) === true) {
      return [];
    }

    return resources.map<Tables.TResource>((item) => ({
      UserName: isNotServiceRole(item) ? userName : 'Admin',
      ResourceId: item.id,
      ResourceName: item.name,
      EventName: record.eventName,
      EventSource: record.eventSource,
      EventTime: record.eventTime,
      AWSRegion: record.awsRegion,
      EventId: record.eventId,
      Service: getServiceName(serviceName),
      Status: getStatus(item, regists.length, removes.length),
    }));
  } catch (err) {
    console.log('error', err);

    Logger.error(`ArnService.start. EventId: ${record.eventId}`, record);
    throw err;
  }
};

const getStatus = (item: ResourceInfo, registCount: number, removeCount: number): string => {
  // 登録削除両方ある場合は
  if (registCount === removeCount) {
    // リソース名の有無で判断する;
    return item.name !== undefined ? Consts.ResourceStatus.CREATED : Consts.ResourceStatus.DELETED;
  }

  return registCount > 0 ? Consts.ResourceStatus.CREATED : Consts.ResourceStatus.DELETED;
};

const getRegistSingleResource = (record: CloudTrailRecord): ResourceInfo[] => {
  const { awsRegion: region, recipientAccountId: account, eventSource: eventSource, eventName: eventName } = record;

  const request = record.requestParameters ? JSON.parse(record.requestParameters) : {};
  const response = record.responseElements ? JSON.parse(record.responseElements) : {};
  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;
  let name = '';
  let id = '';
  let rets: string[] = [];

  switch (key) {
    case 'APPSYNC_CreateGraphqlApi':
      rets = [response.graphqlApi.arn, response.graphqlApi.name];
      break;

    case 'APPSTREAM_CreateFleet':
      rets = [response.fleet.arn, request.name];
      break;

    case 'AIRFLOW_CreateEnvironment':
      rets = [ResourceARNs.AIRFLOW_Environment(region, account, request.Name), request.name];
      break;

    case 'AMPLIFY_CreateApp':
      rets = [response.app.appArn, request.name];
      break;

    case 'AMAZONMQ_CreateBroker':
      rets = [ResourceARNs.AMAZONMQ_Broker(region, account, response.brokerId), request.brokerName];
      break;

    case 'APIGATEWAY_CreateApi':
      rets = [ResourceARNs.APIGATEWAY_Api(region, account, response.apiId), response.name];
      break;

    case 'APIGATEWAY_CreateRestApi':
      rets = [ResourceARNs.APIGATEWAY_Api(region, account, response.id), response.name];
      break;

    case 'APIGATEWAY_CreateVpcLink':
      id = response.id ? response.id : response.vpcLinkId;
      rets = [ResourceARNs.APIGATEWAY_VpcLink(region, account, id), response.name];

      break;

    case 'APIGATEWAY_ImportApi':
      rets = [ResourceARNs.APIGATEWAY_Api(region, account, response.apiId), response.name];
      break;

    case 'APIGATEWAY_ImportRestApi':
      rets = [ResourceARNs.APIGATEWAY_Api(region, account, response.id), response.name];
      break;

    case 'APIGATEWAY_UpdateRestApi':
      rets = [ResourceARNs.APIGATEWAY_Api(region, account, response.id), response.name];
      break;

    case 'APIGATEWAY_CreateDomainName':
      name = response.domainName;
      rets = [ResourceARNs.APIGATEWAY_DomainName(region, account, name), name];
      break;

    case 'APPMESH_CreateMesh':
      rets = [response.mesh.metadata.arn, response.mesh.meshName];
      break;

    case 'APPRUNNER_CreateService':
      rets = [response.service.serviceArn, response.service.serviceName];
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

    case 'CODEARTIFACT_CreateRepository':
      rets = [response.repository.arn, response.repository.name];
      break;

    case 'CODEBUILD_CreateProject':
      rets = [response.project.arn, response.project.name];
      break;

    case 'CODECOMMIT_CreateRepository':
      rets = [ResourceARNs.CODECOMMIT_Repository(region, account, request.repositoryName), request.repositoryName];
      break;

    case 'CODEDEPLOY_CreateApplication':
      name = request.applicationName;
      rets = [ResourceARNs.CODEDEPLOY_Application(region, account, name), name];
      break;

    case 'CODEPIPELINE_CreatePipeline':
      name = response.pipeline.name;
      rets = [ResourceARNs.CODEPIPELINE_Pipeline(region, account, name), name];
      break;

    case 'CLOUD9_CreateEnvironmentEC2':
    case 'CLOUD9_CreateEnvironmentSSH':
      if (response !== null) {
        rets = [
          ResourceARNs.CLOUD9_Environment(region, account, defaultTo(response.environmentId, request.name)),
          request.name,
        ];
      } else {
        rets = [ResourceARNs.CLOUD9_Environment(region, account, request.name), request.name];
      }

      break;

    case 'CLOUDFORMATION_CreateStack':
      const createStackIndex = response.stackId.lastIndexOf('/');

      rets = [response.stackId.substring(0, createStackIndex), request.stackName];
      break;

    case 'CLOUDFORMATION_CreateStackSet':
      rets = [ResourceARNs.CLOUDFORMATION_StackSet(region, account, response.stackSetId), request.stackSetName];
      break;

    case 'CLOUDFORMATION_CreateChangeSet':
      rets = [ResourceARNs.CLOUDFORMATION_Stack(region, account, request.stackName), request.stackName];
      break;

    case 'CLOUDFRONT_CreateDistribution':
    case 'CLOUDFRONT_CopyDistribution':
      rets = [response.distribution.aRN, response.distribution.domainName];
      break;

    case 'CLOUDFRONT_CreateFunction':
      rets = [response.functionSummary.functionMetadata.functionARN, response.functionSummary.name];
      break;

    case 'COGNITO-IDP_CreateUserPool':
      rets = [response.userPool.arn, response.userPool.name];
      break;

    case 'COGNITO-IDENTITY_CreateIdentityPool':
      rets = [ResourceARNs.COGNITO_IDENTITYPOOL(region, account, response.identityPoolId), response.identityPoolName];
      break;

    case 'DATABREW_CreateDataset':
      rets = [ResourceARNs.DATABREW_Dataset(region, account, request.Name), request.Name];
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
    case 'ES_CreateDomain':
      rets = [response.domainStatus.aRN, response.domainStatus.domainName];
      break;

    case 'ELASTICFILESYSTEM_CreateFileSystem':
      rets = [ResourceARNs.ELASTICFILESYSTEM_FileSystem(region, account, response.fileSystemId), response.fileSystemId];
      break;

    case 'EKS_CreateCluster':
      rets = [response.cluster.arn, response.cluster.name];
      break;

    case 'ECS_CreateCluster':
      // Batch用のクラスター作成の場合
      rets = [response.cluster.clusterArn, response.cluster.clusterName];
      break;

    case 'ECR_CreateRepository':
      rets = [response.repository.repositoryArn, response.repository.repositoryName];
      break;

    case 'ECR-PUBLIC_CreateRepository':
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
      const tgw = response.CreateTransitGatewayResponse.transitGateway;
      rets = [tgw.transitGatewayArn, tgw.transitGatewayId];
      break;

    case 'EC2_CreateTransitGatewayRouteTable':
      rets = [
        ResourceARNs.EC2_TransitGatewayRouteTable(
          region,
          account,
          response.CreateTransitGatewayRouteTableResponse.transitGatewayRouteTable.transitGatewayRouteTableId
        ),
        response.CreateTransitGatewayRouteTableResponse.transitGatewayRouteTable.transitGatewayRouteTableId,
      ];
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

    case 'EC2_CreateRouteTable':
      rets = [
        ResourceARNs.EC2_RouteTable(region, account, response.routeTable.routeTableId),
        response.routeTable.routeTableId,
      ];
      break;

    case 'ELASTICBEANSTALK_CreateApplication':
      rets = [
        ResourceARNs.ELASTICBEANSTALK_Application(region, account, request.applicationName),
        request.applicationName,
      ];
      break;

    case 'ELASTICACHE_CreateCacheCluster':
      rets = [response.aRN, response.cacheClusterId];
      break;

    case 'ELASTICACHE_CreateCacheSubnetGroup':
      rets = [response.aRN, response.cacheSubnetGroupName];
      break;

    case 'ELASTICLOADBALANCING_CreateLoadBalancer':
      if (response.loadBalancers !== undefined && response.loadBalancers?.length !== 0) {
        const elbArn = response.loadBalancers[0].loadBalancerArn;

        rets = [elbArn.substring(0, elbArn.lastIndexOf('/')), response.loadBalancers[0].loadBalancerName];
      } else {
        rets = [
          ResourceARNs.ELASTICLOADBALANCING_LoadBalancer(region, account, `app/${request.loadBalancerName}`),
          request.loadBalancerName,
        ];
      }

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

    case 'GLOBALACCELERATOR_CreateAccelerator':
      rets = [response.accelerator.acceleratorArn, response.accelerator.name];
      break;

    case 'GRAFANA_CreateWorkspace':
      rets = [ResourceARNs.GRAFANA_Workspace(region, account, response.workspace.id), response.workspace.name];
      break;

    case 'GLUE_CreateCrawler':
      name = request.name;
      rets = [ResourceARNs.GLUE_Crawler(region, account, name), name];
      break;

    case 'GLUE_CreateDatabase':
      name = request.databaseInput.name;
      rets = [ResourceARNs.GLUE_Database(region, account, name), name];
      break;

    case 'IOT_CreateTopicRule':
      name = request.ruleName;
      rets = [ResourceARNs.IOT_TopicRule(region, account, name), name];
      break;

    case 'KENDRA_CreateIndex':
      rets = [response.indexArn, request.name];
      break;

    case 'KAFKA_CreateClusterV2':
      rets = [response.clusterArn, request.clusterName];
      break;

    case 'KINESIS_CreateStream':
      name = request.streamName;
      rets = [ResourceARNs.KINESIS_Stream(region, account, name), name];
      break;

    case 'KINESISANALYTICS_CreateApplication':
      if (response.applicationSummary) {
        rets = [response.applicationSummary.applicationARN, response.applicationSummary.applicationName];
      }

      if (response.applicationDetail) {
        rets = [response.applicationDetail.applicationARN, response.applicationDetail.applicationName];
      }

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
      if (response === undefined || response.functionArn === undefined) {
        rets = [ResourceARNs.LAMBDA_Function20150331(region, account, request.functionName), request.functionName];
      } else {
        rets = [response.functionArn, response.functionName];
      }

      break;

    case 'NETWORK-FIREWALL_CreateFirewall':
      rets = [response.firewall.firewallArn, response.firewall.firewallName];
      break;

    case 'NETWORKMONITOR_CreateMonitor':
      rets = [response.monitorArn, request.monitorName];
      break;

    case 'REDSHIFT_CreateCluster':
      name = response.clusterIdentifier;
      rets = [ResourceARNs.REDSHIFT_Cluster(region, account, name), name];
      break;

    case 'ROUTE53_CreateHostedZone':
    case 'ROUTE53_CreateServiceLinkedPrivateHostedZone':
    case 'ROUTE53_CreateServiceLinkedPublicHostedZone':
      rets = [
        ResourceARNs.ROUTE53_HostedZone((response.hostedZone.id as string).split('/')[2]),
        response.hostedZone.name,
      ];

      break;

    case 'ROUTE53PROFILES_CreateProfile':
      rets = [response.Profile.Arn, request.Name];
      break;

    case 'ROUTE53RESOLVER_CreateResolverEndpoint':
      rets = [response.resolverEndpoint.arn, response.resolverEndpoint.name];
      break;

    case 'ROUTE53RESOLVER_CreateResolverRule':
      rets = [response.resolverRule.arn, response.resolverRule.id];
      break;

    case 'RDS_CreateDBCluster':
    case 'RDS_RestoreDBClusterToPointInTime':
    case 'RDS_RestoreDBClusterFromSnapshot':
      rets = [response.dBClusterArn, response.dBClusterIdentifier];
      break;

    case 'RDS_CreateGlobalCluster':
      rets = [response.globalClusterArn, response.globalClusterIdentifier];
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

    case 'RDS_ModifyDBInstance':
      if (request.newDBInstanceIdentifier === undefined) {
        break;
      }

      rets = [
        ResourceARNs.RDS_DBInstance(region, account, request.newDBInstanceIdentifier),
        request.newDBInstanceIdentifier,
      ];
      break;

    case 'SERVERLESSREPO_CreateApplication':
      rets = [response.applicationId, response.name];
      break;

    case 'S3_CreateBucket':
    case 'S3EXPRESS_CreateBucket':
      name = request.bucketName;
      rets = [ResourceARNs.S3_Bucket(region, account, name), name];
      break;

    case 'SAGEMAKER_CreateDomain':
      rets = [response.domainArn, request.domainName];
      break;

    case 'SAGEMAKER_CreateNotebookInstance':
      rets = [response.notebookInstanceArn, request.notebookInstanceName];
      break;

    case 'SCHEDULER_CreateSchedule':
      rets = [response.scheduleArn, request.name];
      break;

    case 'SNS_CreateTopic':
      rets = [response.topicArn, request.name];
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
      rets = [response.summary.aRN.substring(0, response.summary.aRN.lastIndexOf('/')), response.summary.name];
      break;

    case 'WAFV2_CreateWebACL':
      rets = [response.summary.aRN.substring(0, response.summary.aRN.lastIndexOf('/')), response.summary.name];
      break;

    case 'IAM_CreateAccessKey':
      rets = [response.accessKey.accessKeyId, response.accessKey.accessKeyId];
      break;

    case 'IAM_CreateRole':
      rets = [response.role.arn, request.roleName];
      break;

    case 'IAM_CreateUser':
      rets = [response.user.arn, response.user.userName];
      break;

    case 'IAM_CreateSAMLProvider':
      rets = [response.sAMLProviderArn, request.name];
      break;

    case 'IAM_CreateServiceLinkedRole':
      if (response.role === undefined) {
        break;
      }

      rets = [response.role.arn, response.role.roleName];

      break;

    case 'EVENTS_PutRule':
      rets = [response.ruleArn, request.name];
      break;

    case 'EVENTS_CreateEventBus':
      rets = [response.eventBusArn, request.name];
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

const getRegistMultiResources = (record: CloudTrailRecord): ResourceInfo[] => {
  const { awsRegion: region, recipientAccountId: account, eventSource, eventName, userAgent } = record;
  const response = record.responseElements ? JSON.parse(record.responseElements) : {};

  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;

  switch (key) {
    case 'EC2_RunInstances':
      if (userAgent === 'elasticmapreduce.amazonaws.com') {
        return [];
      }

      return (response.instancesSet.items as any[]).map<ResourceInfo>((item: { instanceId: any }) => ({
        id: ResourceARNs.EC2_Instances(region, account, item.instanceId),
        name: item.instanceId,
      }));

    case 'EC2_CreateFleet':
      if (response.CreateFleetResponse.fleetInstanceSet === '') {
        return [];
      }

      if (typeof response.CreateFleetResponse.fleetInstanceSet.item.instanceIds.item === 'string') {
        return [
          {
            id: ResourceARNs.EC2_Instances(
              region,
              account,
              response.CreateFleetResponse.fleetInstanceSet.item.instanceIds.item
            ),
            name: response.CreateFleetResponse.fleetInstanceSet.item.instanceIds.item,
          },
        ];
      }

      return (response.CreateFleetResponse.fleetInstanceSet.item.instanceIds.item as string[]).map<ResourceInfo>(
        (item) => ({
          id: ResourceARNs.EC2_Instances(region, account, item),
          name: item,
        })
      );

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
  }

  return [];
};

const getRemoveSingleResource = async (record: CloudTrailRecord): Promise<ResourceInfo[]> => {
  const {
    awsRegion: region,
    recipientAccountId: account,
    eventSource: eventSource,
    eventName: eventName,
    userAgent,
  } = record;

  const request = record.requestParameters ? JSON.parse(record.requestParameters) : {};
  const response = record.responseElements ? JSON.parse(record.responseElements) : {};
  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;
  let arn = undefined;
  let scope = undefined;

  switch (key) {
    case 'AIRFLOW_DeleteEnvironment':
      arn = ResourceARNs.AIRFLOW_Environment(region, account, request.Name);
      break;

    case 'AMAZONMQ_DeleteBroker':
      arn = ResourceARNs.AMAZONMQ_Broker(region, account, response.brokerId);
      break;

    case 'AMPLIFY_DeleteApp':
      if (response.app === undefined || response.app.appArn === undefined) {
        break;
      }

      arn = response.app.appArn;
      break;

    case 'APPSYNC_DeleteGraphqlApi':
      arn = ResourceARNs.APPSYNC_GraphqlApi(region, account, request.apiId);
      break;

    case 'APPSTREAM_DeleteFleet':
      arn = ResourceARNs.APPSTREAM_Fleet(region, account, request.Name);
      break;

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

    case 'APPRUNNER_DeleteService':
      arn = response.service.serviceArn;
      break;

    case 'AUTOSCALING_DeleteAutoScalingGroup':
      arn = ResourceARNs.AUTOSCALING_AutoScalingGroup(region, account, request.autoScalingGroupName);
      break;

    case 'BATCH_DeleteComputeEnvironment':
      arn = request.computeEnvironment;
      break;

    case 'CONNECT_DeleteInstance':
      if (request.InstanceId.length === 36) {
        arn = ResourceARNs.CONNECT_Instance(region, account, request.InstanceId);
      } else {
        arn = decodeURIComponent(request.InstanceId);
      }

      break;

    case 'CODEDEPLOY_DeleteApplication':
      arn = ResourceARNs.CODEDEPLOY_Application(region, account, request.applicationName);
      break;

    case 'CODEPIPELINE_DeletePipeline':
      arn = ResourceARNs.CODEPIPELINE_Pipeline(region, account, request.name);
      break;

    case 'CODEARTIFACT_DeleteRepository':
      arn = response.repository.arn;
      break;

    case 'CODEBUILD_DeleteProject':
      arn = request.name;
      break;

    case 'CODECOMMIT_DeleteRepository':
      arn = ResourceARNs.CODECOMMIT_Repository(region, account, request.repositoryName);
      break;

    case 'CLOUD9_DeleteEnvironment':
      arn = ResourceARNs.CLOUD9_Environment(region, account, request.environmentId);
      break;

    case 'CLOUDFORMATION_DeleteStack':
      const stackName = request.stackName as string;

      // ARN ではない場合、処理スキップする
      if (stackName.startsWith('arn')) {
        arn = stackName.substring(0, stackName.lastIndexOf('/'));
        break;
      }

      arn = ResourceARNs.CLOUDFORMATION_Stack(region, account, stackName);
      break;

    case 'CLOUDFORMATION_DeleteStackSet':
      arn = ResourceARNs.CLOUDFORMATION_StackSet(region, account, request.stackSetName);
      break;

    case 'CLOUDFRONT_DeleteDistribution':
      arn = ResourceARNs.CLOUDFRONT_Distribution(region, account, request.id);
      break;

    case 'CLOUDFRONT_DeleteFunction':
      arn = ResourceARNs.CLOUDFRONT_Function(region, account, request.name);
      break;

    case 'COGNITO-IDP_DeleteUserPool':
      arn = ResourceARNs.COGNITO_USERPOOL(region, account, request.userPoolId);
      break;
    case 'COGNITO-IDENTITY_DeleteIdentityPool':
      arn = ResourceARNs.COGNITO_IDENTITYPOOL(region, account, request.identityPoolId);
      break;

    case 'DATABREW_DeleteDataset':
      arn = ResourceARNs.DATABREW_Dataset(region, account, request.name);
      break;

    case 'DYNAMODB_DeleteTable':
      arn = response.tableDescription.tableArn;
      break;

    case 'DS_DeleteDirectory':
      arn = ResourceARNs.DS_Directory(region, account, response.directoryId);
      break;

    case 'DMS_DeleteReplicationInstance':
      arn = request.replicationInstanceArn;
      break;

    case 'ES_DeleteDomain':
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

    case 'ECR-PUBLIC_DeleteRepository':
      arn = response.repository.repositoryArn;
      break;

    case 'EVENTS_DeleteEventBus':
      arn = ResourceARNs.EVENTS_EventBus(region, account, request.name);
      break;

    case 'EVENTS_DeleteRule':
      arn = ResourceARNs.EVENTS_Rule(region, account, request.name);
      break;

    case 'FIREHOSE_DeleteDeliveryStream':
      arn = ResourceARNs.FIREHOSE_DeliveryStream(region, account, request.deliveryStreamName);
      break;

    case 'FSX_DeleteFileSystem':
      arn = ResourceARNs.FSX_FileSystem(region, account, request.fileSystemId);
      break;

    case 'GLOBALACCELERATOR_DeleteAccelerator':
      arn = request.acceleratorArn;
      break;

    case 'GRAFANA_DeleteWorkspace':
      arn = ResourceARNs.GRAFANA_Workspace(region, account, request.workspaceId);
      break;

    case 'GLUE_DeleteCrawler':
      arn = ResourceARNs.GLUE_Crawler(region, account, request.name);
      break;

    case 'GLUE_DeleteDatabase':
      arn = ResourceARNs.GLUE_Database(region, account, request.name);
      break;

    case 'IOT_DeleteTopicRule':
      arn = ResourceARNs.IOT_TopicRule(region, account, request.ruleName);
      break;

    case 'KAFKA_DeleteCluster':
      arn = response.clusterArn;
      break;

    case 'KENDRA_DeleteIndex':
      arn = ResourceARNs.KENDRA_Index(region, account, request.id);
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
      arn = ResourceARNs.LEX_Bot(region, account, request.name);
      break;

    case 'LAMBDA_DeleteFunction20150331':
      if (userAgent === 'amplifybackend.amazonaws.com') {
        arn = request.functionName;
      } else {
        arn = ResourceARNs.LAMBDA_Function20150331(region, account, request.functionName);
      }
      break;

    case 'NETWORK-FIREWALL_DeleteFirewall':
      arn = response.firewall.firewallArn;
      break;

    case 'NETWORKMONITOR_DeleteMonitor':
      arn = ResourceARNs.NETWORKMONITOR_Monitor(region, account, request.monitorName);

      break;

    case 'REDSHIFT_DeleteCluster':
      arn = ResourceARNs.REDSHIFT_Cluster(region, account, response.clusterIdentifier);
      break;

    case 'ROUTE53_DeleteHostedZone':
      arn = ResourceARNs.ROUTE53_HostedZone(request.id);
      break;

    case 'ROUTE53PROFILES_DeleteProfile':
      arn = response.Profile.Arn;
      break;

    case 'ROUTE53RESOLVER_DeleteResolverEndpoint':
      arn = response.resolverEndpoint.arn;
      break;

    case 'ROUTE53RESOLVER_DeleteResolverRule':
      arn = response.resolverRule.arn;
      break;

    case 'RDS_DeleteDBCluster':
      arn = response.dBClusterArn;
      break;

    case 'RDS_DeleteGlobalCluster':
      arn = response.globalClusterArn;
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

    case 'RDS_ModifyDBInstance':
      if (request.newDBInstanceIdentifier === undefined) {
        break;
      }

      arn = ResourceARNs.RDS_DBInstance(region, account, request.dBInstanceIdentifier);
      break;

    case 'S3_DeleteBucket':
    case 'S3EXPRESS_DeleteBucket':
      arn = ResourceARNs.S3_Bucket(region, account, request.bucketName);
      break;

    case 'SAGEMAKER_DeleteNotebookInstance':
      arn = ResourceARNs.SAGEMAKER_NotebookInstance(region, account, request.notebookInstanceName);
      break;

    case 'SAGEMAKER_DeleteDomain':
      arn = ResourceARNs.SAGEMAKER_Domain(region, account, request.domainId);
      break;

    case 'SCHEDULER_DeleteSchedule':
      arn = ResourceARNs.SCHEDULER_Schedule(region, account, request.name);
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
      scope = request.scope as string;

      if (scope === 'CLOUDFRONT') {
        scope = 'global';
      } else {
        scope = scope.toLowerCase();
      }

      arn = ResourceARNs.WAFV2_IPSet(region, account, `${scope}/ipset/${request.name}`);
      break;

    case 'WAFV2_DeleteWebACL':
      scope = request.scope as string;

      if (scope === 'CLOUDFRONT') {
        scope = 'global';
      } else {
        scope = scope.toLowerCase();
      }

      arn = ResourceARNs.WAFV2_WebACL(region, account, `${scope}/webacl/${request.name}`);
      break;

    case 'ELASTICBEANSTALK_DeleteApplication':
      arn = ResourceARNs.ELASTICBEANSTALK_Application(region, account, request.applicationName);
      break;

    case 'ELASTICACHE_DeleteCacheCluster':
      arn = response.aRN;
      break;

    case 'ELASTICACHE_DeleteCacheSubnetGroup':
      arn = ResourceARNs.ELASTICACHE_CacheSubnetGroup(region, account, request.cacheSubnetGroupName);
      break;

    case 'ELASTICLOADBALANCING_DeleteLoadBalancer':
      if (request.loadBalancerArn !== undefined) {
        arn = request.loadBalancerArn.substring(0, request.loadBalancerArn.lastIndexOf('/'));
      } else {
        arn = ResourceARNs.ELASTICLOADBALANCING_LoadBalancer(region, account, `app/${request.loadBalancerName}`);
      }

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

    case 'IAM_DeleteUser':
      arn = ResourceARNs.IAM_User(region, account, request.userName);
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

    case 'EC2_DeleteTransitGatewayRouteTable':
      arn = ResourceARNs.EC2_TransitGatewayRouteTable(
        region,
        account,
        request.DeleteTransitGatewayRouteTableRequest.TransitGatewayRouteTableId
      );
      break;

    case 'EC2_DeleteVolume':
      arn = ResourceARNs.EC2_Volume(region, account, request.volumeId);
      break;

    case 'EC2_DeleteVpc':
      arn = ResourceARNs.EC2_Vpc(region, account, request.vpcId);
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
      const groupName = request.groupName;

      // グループID 存在する場合、既存リソースから
      if (groupId) {
        arn = ResourceARNs.EC2_SecurityGroup(region, account, groupId);
        break;
      }

      const results = await ResourceService.getByName(eventSource, groupName);
      const finded = results.find((item) =>
        item.ResourceId.startsWith(`arn:aws:ec2:${region}:${account}:security-group`)
      );

      if (finded !== undefined) {
        arn = finded.ResourceId;
      }

      break;

    case 'EC2_DeleteRouteTable':
      arn = ResourceARNs.EC2_RouteTable(region, account, request.routeTableId);
      break;

    case 'BACKUP_DeleteBackupPlan':
      arn = response.backupPlanArn;
      break;

    case 'BACKUP_DeleteBackupVault':
      arn = ResourceARNs.BACKUP_BackupVault(region, account, request.backupVaultName);
      break;
  }

  // 未対応のリソース
  if (!arn) return [];

  return [
    {
      id: arn,
    },
  ];
};

const getRemoveMultiResources = (record: CloudTrailRecord): ResourceInfo[] => {
  const { awsRegion: region, recipientAccountId: account, eventSource: eventSource, eventName: eventName } = record;

  const request = record.requestParameters ? JSON.parse(record.requestParameters) : {};
  const response = record.responseElements ? JSON.parse(record.responseElements) : {};
  const key = `${eventSource.split('.')[0].toUpperCase()}_${eventName}`;

  switch (key) {
    case 'EC2_TerminateInstances':
      return (response.instancesSet.items as any[]).map<ResourceInfo>(
        (item: { instanceId: string; currentState: { code: number }; previousState: { code: number } }) => ({
          id: ResourceARNs.EC2_Instances(region, account, item.instanceId),
        })
      );

    case 'EC2_DeleteVpcEndpoints':
      let ids = request.DeleteVpcEndpointsRequest.VpcEndpointId;

      if (!Array.isArray(ids)) {
        ids = [request.DeleteVpcEndpointsRequest.VpcEndpointId];
      }

      return (ids as any[]).map<ResourceInfo>((item: { content: string }) => ({
        id: ResourceARNs.EC2_VpcEndpoints(region, account, item.content),
        name: item.content,
      }));

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

const getServiceName = (serviceName: string) => {
  if (UPPERCASE.includes(serviceName)) return serviceName;

  if (serviceName === 'STATES') return 'StepFunction';
  if (serviceName === 'LOGS') return 'CloudWatchLogs';
  if (serviceName === 'ES') return 'Elasticsearch';
  if (serviceName === 'DS') return 'DirectoryService';

  return capitalize(serviceName);
};

const isExcludeUser = (userName: string): Boolean => {
  if (userName === 'AWSServiceRoleForAmazonSageMakerNotebooks') return true;
  if (userName === 'AWSServiceRoleForAutoScaling') return true;
  if (userName === 'AWSServiceRoleForBatch') return true;
  if (userName === 'AWSServiceRoleForLambdaReplicator') return true;
  if (userName === 'AWSServiceRoleForAmazonElasticFileSystem') return true;
  if (userName === 'AWSServiceRoleForCloudFormationStackSetsOrgMember') return true;

  return false;
};

const isExcludeRecord = (record: CloudTrailRecord): Boolean => {
  const serviceName = record.eventSource.split('.')[0].toUpperCase();
  const key = `${serviceName}_${record.eventName}`;
  const request = record.requestParameters ? JSON.parse(record.requestParameters) : {};
  const response = record.responseElements ? JSON.parse(record.responseElements) : {};

  if (!isEmpty(record.sharedEventId)) {
    return true;
  }

  if (key === 'AMPLIFY_CreateApp') {
    return response.app === undefined || response.app.appArn === undefined;
  }

  if (key === 'LEX_DeleteBot' && !request.name) {
    return true;
  }

  return false;
};

const isNotServiceRole = (item: ResourceInfo): Boolean => {
  return !item.id.startsWith('arn:aws:iam::334678299258:role/aws-service-role/');
};
