import { defaultTo, capitalize } from 'lodash';
import { ResourceARNs } from '@src/apps/utils/awsArns';
import { CloudTrail, Tables } from 'typings';

const MULTI_TASK = ['EC2_RunInstances'];

export const start = (record: CloudTrail.Record): Tables.Resource[] | undefined => {
  const serviceName = record.eventSource.split('.')[0].toUpperCase();
  const key = `${serviceName}_${record.eventName}`;

  if (MULTI_TASK.includes(key)) {
    return getResourceInfos(record).map((item) => ({
      UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
      ResourceId: item[0],
      ResourceName: item[1],
      EventName: record.eventName,
      EventSource: record.eventSource,
      EventTime: record.eventTime,
      AWSRegion: record.awsRegion,
      IdentityType: record.userIdentity.type,
      UserAgent: record.userAgent,
      EventId: record.eventID,
      Service: getServiceName(serviceName),
    }));
  }

  const infos = getResourceInfo(record);

  if (!infos) return undefined;

  return [
    {
      UserName: defaultTo(record.userIdentity?.userName, record.userIdentity.sessionContext?.sessionIssuer?.userName),
      ResourceId: infos[0],
      ResourceName: infos[1],
      EventName: record.eventName,
      EventSource: record.eventSource,
      EventTime: record.eventTime,
      AWSRegion: record.awsRegion,
      IdentityType: record.userIdentity.type,
      UserAgent: record.userAgent,
      EventId: record.eventID,
      Service: getServiceName(serviceName),
    },
  ];
};

const getResourceInfo = (record: CloudTrail.Record): string[] | undefined => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const key = `${record.eventSource.split('.')[0].toUpperCase()}_${record.eventName}`;
  let name = '';

  switch (key) {
    case 'APIGATEWAY_CreateApi':
      return [
        ResourceARNs.APIGATEWAY_Api(region, account, record.responseElements.apiId),
        record.responseElements.name,
      ];
    case 'APIGATEWAY_CreateRestApi':
      return [ResourceARNs.APIGATEWAY_Api(region, account, record.responseElements.id), record.responseElements.name];
    case 'APIGATEWAY_CreateVpcLink':
      return [
        ResourceARNs.APIGATEWAY_VpcLink(region, account, record.responseElements.vpcLinkId),
        record.responseElements.name,
      ];
    case 'APIGATEWAY_ImportRestApi':
      return [ResourceARNs.APIGATEWAY_Api(region, account, record.responseElements.id), record.responseElements.name];

    case 'APPMESH_CreateMesh':
      return [record.responseElements.mesh.metadata.arn, record.responseElements.mesh.meshName];
    case 'AUTOSCALING_CreateAutoScalingGroup':
      name = record.requestParameters.autoScalingGroupName;
      return [ResourceARNs.AUTOSCALING_AutoScalingGroup(region, account, name), name];

    case 'BATCH_CreateComputeEnvironment':
      return [record.responseElements.computeEnvironmentArn, record.responseElements.computeEnvironmentName];

    case 'BACKUP_CreateBackupPlan':
      return [record.responseElements.backupPlanArn, record.responseElements.backupPlanId];
    case 'BACKUP_CreateBackupVault':
      return [record.responseElements.backupVaultArn, record.responseElements.backupVaultName];

    case 'CONNECT_CreateInstance':
      return [record.responseElements.Arn, record.requestParameters.InstanceAlias];
    case 'CODEDEPLOY_CreateApplication':
      name = record.requestParameters.applicationName;
      return [ResourceARNs.CODEDEPLOY_Application(region, account, name), name];
    case 'CODEBUILD_CreateProject':
      return [record.responseElements.project.arn, record.responseElements.project.name];
    case 'CLOUDFORMATION_CreateStack':
      return [record.responseElements.stackId, record.requestParameters.stackName];
    case 'CLOUDFRONT_CreateDistribution':
      return [record.responseElements.distribution.aRN, record.responseElements.distribution.domainName];

    case 'DYNAMODB_CreateTable':
      return [record.responseElements.tableDescription.tableArn, record.responseElements.tableDescription.tableName];
    case 'DS_CreateMicrosoftAD':
      return [
        ResourceARNs.DS_Directory(region, account, record.responseElements.directoryId),
        record.requestParameters.name,
      ];
    case 'DMS_CreateReplicationInstance':
      return [
        record.responseElements.replicationInstance.replicationInstanceArn,
        record.responseElements.replicationInstance.replicationInstanceIdentifier,
      ];

    case 'EVENTS_PutRule':
      return [record.responseElements.ruleArn, record.requestParameters.name];
    case 'ES_CreateElasticsearchDomain':
      return [record.responseElements.domainStatus.aRN, record.responseElements.domainStatus.domainName];
    case 'ELASTICFILESYSTEM_CreateFileSystem':
      return [
        ResourceARNs.ELASTICFILESYSTEM_FileSystem(region, account, record.responseElements.fileSystemId),
        record.responseElements.name,
      ];
    case 'EKS_CreateCluster':
      return [record.responseElements.cluster.arn, record.responseElements.cluster.name];
    case 'ECS_CreateCluster':
      return [record.responseElements.cluster.clusterArn, record.responseElements.cluster.clusterName];
    case 'ECR_CreateRepository':
      return [record.responseElements.repository.repositoryArn, record.responseElements.repository.repositoryName];

    case 'EC2_CreateClientVpnEndpoint':
      return [
        ResourceARNs.EC2_ClientVpnEndpoint(
          region,
          account,
          record.responseElements.CreateClientVpnEndpointResponse.clientVpnEndpointId
        ),
        record.responseElements.CreateClientVpnEndpointResponse.dnsName,
      ];
    case 'EC2_CreateCustomerGateway':
      name = record.responseElements.customerGateway.customerGatewayId;
      return [ResourceARNs.EC2_CustomerGateway(region, account, name), name];
    case 'EC2_CreateInternetGateway':
      name = record.responseElements.internetGateway.internetGatewayId;
      return [ResourceARNs.EC2_InternetGateway(region, account, name), name];
    case 'EC2_CreateLaunchTemplate':
      name = record.responseElements.CreateLaunchTemplateResponse.launchTemplate.launchTemplateId;
      return [ResourceARNs.EC2_LaunchTemplate(region, account, name), name];
    case 'EC2_CreateNatGateway':
      name = record.responseElements.CreateNatGatewayResponse.natGateway.natGatewayId;
      return [ResourceARNs.EC2_NatGateway(region, account, name), name];
    case 'EC2_CreateNetworkInsightsPath':
      name = record.responseElements.CreateNetworkInsightsPathResponse.networkInsightsPath.networkInsightsPathId;
      return [ResourceARNs.EC2_NetworkInsightsPath(region, account, name), name];
    case 'EC2_CreateSnapshot':
      name = record.responseElements.snapshotId;
      return [ResourceARNs.EC2_Snapshot(region, account, name), name];
    case 'EC2_CreateSnapshots':
      name = record.responseElements.CreateSnapshotsResponse.snapshotSet.item.snapshotId;
      return [ResourceARNs.EC2_Snapshot(region, account, name), name];
    case 'EC2_CreateSubnet':
      name = record.responseElements.subnet.subnetId;
      return [ResourceARNs.EC2_Subnet(region, account, name), name];
    case 'EC2_CreateTransitGateway':
      return [
        record.responseElements.CreateTransitGatewayResponse.transitGateway.transitGatewayArn,
        record.responseElements.publicIp,
      ];
    case 'EC2_CreateVolume':
      name = record.responseElements.volumeId;
      return [ResourceARNs.EC2_Volume(region, account, name), name];
    case 'EC2_CreateVpc':
      name = record.responseElements.vpc.vpcId;
      return [ResourceARNs.EC2_Vpc(region, account, name), name];
    case 'EC2_CreateVpcEndpoint':
      name = record.responseElements.CreateVpcEndpointResponse.vpcEndpoint.vpcEndpointId;
      return [ResourceARNs.EC2_VpcEndpoints(region, account, name), name];
    case 'EC2_CreateVpcPeeringConnection':
      name = record.responseElements.vpcPeeringConnection.vpcPeeringConnectionId;
      return [ResourceARNs.EC2_VpcPeeringConnection(region, account, name), name];
    case 'EC2_CreateVpnConnection':
      name = record.responseElements.vpnConnection.vpnConnectionId;
      return [ResourceARNs.EC2_VpnConnection(region, account, name), name];
    case 'EC2_CreateVpnGateway':
      name = record.responseElements.vpnGateway.vpnGatewayId;
      return [ResourceARNs.EC2_VpnGateway(region, account, name), name];
    case 'EC2_CreateImage':
      return [ResourceARNs.EC2_Image(region, account, record.responseElements.imageId), record.requestParameters.name];
    case 'EC2_AllocateAddress':
      return [
        ResourceARNs.EC2_IPAddress(region, account, record.responseElements.allocationId),
        record.responseElements.publicIp,
      ];
    case 'EC2_CreateSecurityGroup':
      name = record.responseElements.groupId;
      return [ResourceARNs.EC2_SecurityGroup(region, account, name), name];

    case 'ELASTICACHE_CreateCacheCluster':
      return [record.responseElements.aRN, record.responseElements.cacheClusterId];
    case 'ELASTICACHE_CreateCacheSubnetGroup':
      return [record.responseElements.aRN, record.responseElements.cacheSubnetGroupName];
    case 'ELASTICLOADBALANCING_CreateLoadBalancer':
      return [
        record.responseElements.loadBalancers[0].loadBalancerArn,
        record.responseElements.loadBalancers[0].loadBalancerName,
      ];
    case 'ELASTICLOADBALANCING_CreateTargetGroup':
      return [
        record.responseElements.targetGroups[0].targetGroupArn,
        record.responseElements.targetGroups[0].targetGroupName,
      ];

    case 'FIREHOSE_CreateDeliveryStream':
      return [record.responseElements.deliveryStreamARN, record.requestParameters.deliveryStreamName];
    case 'GLUE_CreateDatabase':
      name = record.requestParameters.databaseInput.name;
      return [ResourceARNs.GLUE_Database(region, account, name), name];
    case 'IOT_CreateTopicRule':
      name = record.requestParameters.ruleName;
      return [ResourceARNs.IOT_TopicRule(region, account, name), name];

    case 'KINESIS_CreateStream':
      name = record.requestParameters.streamName;
      return [ResourceARNs.KINESIS_Stream(region, account, name), name];
    case 'KINESISANALYTICS_CreateApplication':
      return [
        record.responseElements.applicationSummary.applicationARN,
        record.responseElements.applicationSummary.applicationName,
      ];

    case 'LOGS_CreateLogGroup':
      name = record.requestParameters.logGroupName;
      return [ResourceARNs.LOGS_LogGroup(region, account, name), name];

    case 'LEX_CreateBot':
      name = record.responseElements.botName;
      return [ResourceARNs.LEX_Bot(region, account, name), name];
    case 'LAMBDA_CreateFunction20150331':
      return [record.responseElements.functionArn, record.responseElements.functionName];

    case 'MONITORING_PutDashboard':
      name = record.requestParameters.dashboardName;
      return [ResourceARNs.MONITORING_Dashboard(region, account, name), name];
    case 'MONITORING_PutMetricAlarm':
      name = record.requestParameters.alarmName;
      return [ResourceARNs.MONITORING_Alarm(region, account, name), name];

    case 'NETWORK-FIREWALL_CreateFirewall':
      return [record.responseElements.firewall.firewallArn, record.responseElements.firewall.firewallName];

    case 'REDSHIFT_CreateCluster':
      name = record.responseElements.clusterIdentifier;
      return [ResourceARNs.REDSHIFT_Cluster(region, account, name), name];
    case 'ROUTE53_CreateHostedZone':
      return [
        ResourceARNs.ROUTE53_HostedZone(
          region,
          account,
          (record.responseElements.hostedZone.id as string).split('/')[2]
        ),
        record.responseElements.hostedZone.name,
      ];
    case 'RDS_CreateDBCluster':
      return [record.responseElements.dBClusterArn, record.responseElements.dBClusterIdentifier];
    case 'RDS_CreateDBClusterParameterGroup':
      return [record.responseElements.dBClusterParameterGroupArn, record.responseElements.dBClusterParameterGroupName];
    case 'RDS_CreateDBInstance':
      return [record.responseElements.dBInstanceArn, record.responseElements.dBInstanceIdentifier];
    case 'RDS_CreateDBParameterGroup':
      return [record.responseElements.dBParameterGroupArn, record.responseElements.dBParameterGroupName];
    case 'RDS_CreateDBProxy':
      return [record.responseElements.dBProxy.dBProxyArn, record.responseElements.dBProxy.dBProxyName];
    case 'RDS_CreateDBSnapshot':
      return [record.responseElements.dBSnapshotArn, record.responseElements.dBSnapshotIdentifier];
    case 'RDS_CopyDBSnapshot':
      return [record.responseElements.dBSnapshotArn, record.responseElements.dBSnapshotIdentifier];
    case 'RDS_CreateDBSubnetGroup':
      return [record.responseElements.dBSubnetGroupArn, record.responseElements.dBSubnetGroupName];
    case 'RDS_CreateDBClusterSnapshot':
      return [record.responseElements.dBClusterSnapshotArn, record.responseElements.dBClusterSnapshotIdentifier];

    case 'SERVERLESSREPO_CreateApplication':
      return [record.responseElements.applicationId, record.responseElements.name];
    case 'S3_CreateBucket':
      name = record.requestParameters.bucketName;
      return [ResourceARNs.S3_Bucket(region, account, name), name];
    case 'SNS_CreateTopic':
      return [record.responseElements.topicArn, record.requestParameters.name];
    case 'SQS_CreateQueue':
      name = record.requestParameters.queueName;
      return [ResourceARNs.SQS_Queue(region, account, name), name];
    case 'STATES_CreateStateMachine':
      return [record.responseElements.stateMachineArn, record.requestParameters.name];
    case 'SYNTHETICS_CreateCanary':
      name = record.responseElements.Canary.Name;
      return [ResourceARNs.SYNTHETICS_Canary(region, account, name), name];

    case 'TIMESTREAM_CreateDatabase':
      return [record.responseElements.database.arn, record.responseElements.database.databaseName];
    case 'TRANSFER_CreateServer':
      name = record.responseElements.serverId;
      return [ResourceARNs.TRANSFER_Server(region, account, name), name];

    case 'WAFV2_CreateIPSet':
      return [record.responseElements.summary.aRN, record.responseElements.summary.name];
    case 'WAFV2_CreateWebACL':
      return [record.responseElements.summary.aRN, record.responseElements.summary.name];

    case 'IAM_CreateAccessKey':
      return [record.responseElements.accessKey.accessKeyId, record.responseElements.accessKey.userName];
    case 'IAM_CreateRole':
      return [record.responseElements.role.arn, record.responseElements.role.roleName];
    case 'IAM_CreateSAMLProvider':
      return [record.responseElements.sAMLProviderArn, record.requestParameters.name];
  }

  return undefined;
};

const getResourceInfos = (record: CloudTrail.Record): string[][] => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const key = `${record.eventSource.split('.')[0].toUpperCase()}_${record.eventName}`;

  switch (key) {
    case 'EC2_RunInstances':
      return (record.responseElements.instancesSet.items as any[]).map((item: { instanceId: any }) => [
        ResourceARNs.EC2_Instances(region, account, item.instanceId),
        item.instanceId,
      ]);
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
