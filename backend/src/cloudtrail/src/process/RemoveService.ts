// import { Consts } from '@src/apps/utils';
// import { ResourceARNs } from '@src/apps/utils/awsArns';
// import { ResourceService } from '@src/services';
// import { CloudTrail, Tables } from 'typings';

// const MULTI_TASK = ['EC2_TerminateInstances', 'MONITORING_DeleteAlarms', 'MONITORING_DeleteDashboards'];

// export const start = async (record: CloudTrail.Record): Promise<Tables.TResourceKey[] | undefined> => {
//   const key = `${record.eventSource.split('.')[0].toUpperCase()}_${record.eventName}`;

//   if (MULTI_TASK.includes(key)) {
//     return getResourceArns(record).map((item) => ({
//       ResourceId: item,
//     }));
//   }

//   const arn = await getResourceArn(record);

//   if (!arn) return undefined;

//   return [
//     {
//       ResourceId: arn,
//     },
//   ];
// };

// const getResourceArn = async (record: CloudTrail.Record) => {
//   const region = record.awsRegion;
//   const account = record.recipientAccountId;
//   const key = `${record.eventSource.split('.')[0].toUpperCase()}_${record.eventName}`;

//   switch (key) {
//     case 'APIGATEWAY_DeleteApi':
//       return ResourceARNs.APIGATEWAY_Api(region, account, record.requestParameters.apiId);
//     case 'APIGATEWAY_DeleteRestApi':
//       return ResourceARNs.APIGATEWAY_Api(region, account, record.requestParameters.restApiId);
//     case 'APIGATEWAY_DeleteVpcLink':
//       return ResourceARNs.APIGATEWAY_VpcLink(region, account, record.requestParameters.vpcLinkId);
//     case 'APIGATEWAY_DeleteDomainName':
//       return ResourceARNs.APIGATEWAY_DomainName(region, account, record.requestParameters.domainName);

//     case 'APPMESH_DeleteMesh':
//       return record.responseElements.mesh.metadata.arn;
//     case 'AUTOSCALING_DeleteAutoScalingGroup':
//       return ResourceARNs.AUTOSCALING_AutoScalingGroup(region, account, record.requestParameters.autoScalingGroupName);

//     case 'BATCH_DeleteComputeEnvironment':
//       return record.requestParameters.computeEnvironment;

//     case 'CONNECT_DeleteInstance':
//       return decodeURIComponent(record.requestParameters.InstanceId);
//     case 'CODEDEPLOY_DeleteApplication':
//       return ResourceARNs.CODEDEPLOY_Application(region, account, record.requestParameters.applicationName);
//     case 'CODEBUILD_DeleteProject':
//       return record.requestParameters.name;
//     case 'CLOUDFORMATION_DeleteStack':
//       const stackName = record.requestParameters.stackName as string;

//       // ARN ではない場合、名前で検索する
//       if (!stackName.startsWith('arn')) {
//         const resource = await ResourceService.getByName(Consts.EVENT_SOURCE.CLOUDFORMATION, stackName, 'stack');

//         // リソースあり
//         if (resource.length !== 0) {
//           return resource[0].ResourceId;
//         }
//       }

//       return stackName;

//     case 'CLOUDFRONT_DeleteDistribution':
//       return ResourceARNs.CLOUDFRONT_Distribution(region, account, record.requestParameters.id);

//     case 'COGNITO-IDP_DeleteUserPool':
//       return ResourceARNs.COGNITO_USERPOOL(region, account, record.requestParameters.userPoolId);
//     case 'COGNITO-IDENTITY_DeleteIdentityPool':
//       return ResourceARNs.COGNITO_IDENTITYPOOL(region, account, record.requestParameters.identityPoolId);

//     case 'DYNAMODB_DeleteTable':
//       return record.responseElements.tableDescription.tableArn;
//     case 'DS_DeleteDirectory':
//       return ResourceARNs.DS_Directory(region, account, record.responseElements.directoryId);
//     case 'DMS_DeleteReplicationInstance':
//       return record.responseElements.replicationInstance.replicationInstanceArn;

//     case 'ES_DeleteElasticsearchDomain':
//       return record.responseElements.domainStatus.aRN;
//     case 'ELASTICFILESYSTEM_DeleteFileSystem':
//       return ResourceARNs.ELASTICFILESYSTEM_FileSystem(region, account, record.requestParameters.fileSystemId);
//     case 'EKS_DeleteCluster':
//       return record.responseElements.cluster.arn;
//     case 'ECS_DeleteCluster':
//       return record.responseElements.cluster.clusterArn;
//     case 'ECR_DeleteRepository':
//       return record.responseElements.repository.repositoryArn;
//     case 'EVENTS_DeleteRule':
//       return record.responseElements.ruleArn;

//     case 'FIREHOSE_DeleteDeliveryStream':
//       return ResourceARNs.FIREHOSE_DeliveryStream(region, account, record.requestParameters.deliveryStreamName);
//     case 'FSX_DeleteFileSystem':
//       return ResourceARNs.FSX_FileSystem(region, account, record.requestParameters.fileSystemId);

//     case 'GLUE_DeleteDatabase':
//       return ResourceARNs.GLUE_Database(region, account, record.requestParameters.name);
//     case 'IOT_DeleteTopicRule':
//       return ResourceARNs.IOT_TopicRule(region, account, record.requestParameters.ruleName);

//     case 'KINESIS_DeleteStream':
//       return ResourceARNs.KINESIS_Stream(region, account, record.requestParameters.streamName);
//     case 'KINESISANALYTICS_DeleteApplication':
//       return ResourceARNs.KINESISANALYTICS_Application(region, account, record.requestParameters.applicationName);

//     case 'LOGS_DeleteLogGroup':
//       return ResourceARNs.LOGS_LogGroup(region, account, record.requestParameters.logGroupName);
//     case 'LEX_DeleteBot':
//       if (!record.requestParameters.name) return undefined;
//       return ResourceARNs.LEX_Bot(region, account, record.requestParameters.name);
//     case 'LAMBDA_DeleteFunction20150331':
//       return ResourceARNs.LAMBDA_Function20150331(region, account, record.requestParameters.functionName);

//     case 'NETWORK-FIREWALL_DeleteFirewall':
//       return record.responseElements.firewall.firewallArn;

//     case 'REDSHIFT_DeleteCluster':
//       return ResourceARNs.REDSHIFT_Cluster(region, account, record.responseElements.clusterIdentifier);
//     case 'ROUTE53_DeleteHostedZone':
//       return ResourceARNs.ROUTE53_HostedZone(region, account, record.requestParameters.id);
//     case 'RDS_DeleteDBCluster':
//       return record.responseElements.dBClusterArn;
//     case 'RDS_DeleteDBClusterParameterGroup':
//       return ResourceARNs.RDS_DBClusterParameterGroup(
//         region,
//         account,
//         record.requestParameters.dBClusterParameterGroupName
//       );
//     case 'RDS_DeleteDBInstance':
//       return record.responseElements.dBInstanceArn;
//     case 'RDS_DeleteDBParameterGroup':
//       return ResourceARNs.RDS_DBParameterGroup(region, account, record.requestParameters.dBParameterGroupName);
//     case 'RDS_DeleteDBProxy':
//       return record.responseElements.dBProxy.dBProxyArn;
//     case 'RDS_DeleteDBSnapshot':
//       return record.responseElements.dBSnapshotArn;
//     case 'RDS_DeleteDBSubnetGroup':
//       return ResourceARNs.RDS_DBSubnetGroup(region, account, record.requestParameters.dBSubnetGroupName);
//     case 'RDS_DeleteOptionGroup':
//       return ResourceARNs.RDS_DBOptionGroup(region, account, record.requestParameters.optionGroupName);

//     case 'S3_DeleteBucket':
//       return ResourceARNs.S3_Bucket(region, account, record.requestParameters.bucketName);
//     case 'SNS_DeleteTopic':
//       return record.requestParameters.topicArn;
//     case 'SQS_DeleteQueue':
//       const queueUrl: string = record.requestParameters.queueUrl;
//       const queueName = queueUrl.split('/')[queueUrl.split('/').length - 1];
//       return ResourceARNs.SQS_Queue(region, account, queueName);
//     case 'STATES_DeleteStateMachine':
//       return record.requestParameters.stateMachineArn;
//     case 'SYNTHETICS_DeleteCanary':
//       return ResourceARNs.SYNTHETICS_Canary(region, account, record.requestParameters.name);
//     case 'TIMESTREAM_DeleteDatabase':
//       return ResourceARNs.TIMESTREAM_Database(region, account, record.requestParameters.databaseName);
//     case 'TRANSFER_DeleteServer':
//       return ResourceARNs.TRANSFER_Server(region, account, record.requestParameters.serverId);

//     case 'WAFV2_DeleteIPSet':
//       return ResourceARNs.WAFV2_IPSet(
//         region,
//         account,
//         `${(record.requestParameters.scope as string).toLowerCase()}/ipset/${record.requestParameters.name}/${
//           record.requestParameters.id
//         }`
//       );
//     case 'WAFV2_DeleteWebACL':
//       return ResourceARNs.WAFV2_WebACL(
//         region,
//         account,
//         `${(record.requestParameters.scope as string).toLowerCase()}/webacl/${record.requestParameters.name}/${
//           record.requestParameters.id
//         }`
//       );

//     case 'ELASTICACHE_DeleteCacheCluster':
//       return record.responseElements.aRN;
//     case 'ELASTICACHE_DeleteCacheSubnetGroup':
//       return ResourceARNs.ELASTICACHE_CacheSubnetGroup(region, account, record.requestParameters.cacheSubnetGroupName);
//     case 'ELASTICLOADBALANCING_DeleteLoadBalancer':
//       return record.requestParameters.loadBalancerArn;
//     case 'ELASTICLOADBALANCING_DeleteTargetGroup':
//       return record.requestParameters.targetGroupArn;

//     case 'IAM_DeleteAccessKey':
//       return record.requestParameters.accessKeyId;
//     case 'IAM_DeleteRole':
//       return ResourceARNs.IAM_Role(region, account, record.requestParameters.roleName);
//     case 'IAM_DeleteSAMLProvider':
//       return record.requestParameters.sAMLProviderArn;
//     case 'IAM_DeleteServiceLinkedRole':
//       return ResourceARNs.IAM_Role(region, account, record.requestParameters.roleName);

//     case 'EC2_DeleteClientVpnEndpoint':
//       return ResourceARNs.EC2_ClientVpnEndpoint(
//         region,
//         account,
//         record.requestParameters.DeleteClientVpnEndpointRequest.ClientVpnEndpointId
//       );
//     case 'EC2_DeleteCustomerGateway':
//       return ResourceARNs.EC2_CustomerGateway(region, account, record.requestParameters.customerGatewayId);
//     case 'EC2_DeleteInternetGateway':
//       return ResourceARNs.EC2_InternetGateway(region, account, record.requestParameters.internetGatewayId);
//     case 'EC2_DeleteLaunchTemplate':
//       return ResourceARNs.EC2_LaunchTemplate(
//         region,
//         account,
//         record.requestParameters.DeleteLaunchTemplateRequest.LaunchTemplateId
//       );
//     case 'EC2_DeleteNatGateway':
//       return ResourceARNs.EC2_NatGateway(
//         region,
//         account,
//         record.responseElements.DeleteNatGatewayResponse.natGatewayId
//       );
//     case 'EC2_DeleteNetworkInsightsPath':
//       return ResourceARNs.EC2_NetworkInsightsPath(
//         region,
//         account,
//         record.responseElements.DeleteNetworkInsightsPathResponse.networkInsightsPathId
//       );
//     case 'EC2_DeleteSnapshot':
//       return ResourceARNs.EC2_Snapshot(region, account, record.requestParameters.snapshotId);
//     case 'EC2_DeleteSubnet':
//       return ResourceARNs.EC2_Subnet(region, account, record.requestParameters.subnetId);
//     case 'EC2_DeleteTransitGateway':
//       return ResourceARNs.EC2_TransitGateway(
//         region,
//         account,
//         record.requestParameters.DeleteTransitGatewayRequest.TransitGatewayId
//       );
//     case 'EC2_DeleteVolume':
//       return ResourceARNs.EC2_Volume(region, account, record.requestParameters.volumeId);
//     case 'EC2_DeleteVpc':
//       return ResourceARNs.EC2_Vpc(region, account, record.requestParameters.vpcId);
//     case 'EC2_DeleteVpcEndpoints':
//       return ResourceARNs.EC2_VpcEndpoints(
//         region,
//         account,
//         record.requestParameters.DeleteVpcEndpointsRequest.VpcEndpointId.content
//       );
//     case 'EC2_DeleteVpcPeeringConnection':
//       return ResourceARNs.EC2_VpcPeeringConnection(region, account, record.requestParameters.vpcPeeringConnectionId);
//     case 'EC2_DeleteVpnConnection':
//       return ResourceARNs.EC2_VpnConnection(region, account, record.requestParameters.vpnConnectionId);
//     case 'EC2_DeleteVpnGateway':
//       return ResourceARNs.EC2_VpnGateway(region, account, record.requestParameters.vpnGatewayId);
//     case 'EC2_DeregisterImage':
//       return ResourceARNs.EC2_Image(region, account, record.requestParameters.imageId);
//     case 'EC2_ReleaseAddress':
//       return ResourceARNs.EC2_IPAddress(region, account, record.requestParameters.allocationId);
//     case 'EC2_TerminateInstances':
//       return (record.responseElements.instancesSet.items as any[]).map((item: { instanceId: any }) =>
//         ResourceARNs.EC2_Instances(region, account, item.instanceId)
//       );
//     case 'EC2_DeleteSecurityGroup':
//       const groupId = record.requestParameters.groupId;
//       const groupName = record.requestParameters.groupName;

//       // グループID 存在しない場合、リソース前から探す
//       if (!groupId) {
//         const resource = await ResourceService.getByName(Consts.EVENT_SOURCE.EC2, groupName, 'security-group');

//         // リソースあり
//         if (resource.length !== 0) {
//           return resource[0].ResourceId;
//         }
//       }

//       return ResourceARNs.EC2_SecurityGroup(region, account, groupId);

//     case 'BACKUP_DeleteBackupPlan':
//       return record.responseElements.backupPlanArn;
//     case 'BACKUP_DeleteBackupVault':
//       return ResourceARNs.BACKUP_BackupVault(region, account, record.requestParameters.backupVaultName);
//   }

//   return undefined;
// };

// const getResourceArns = (record: CloudTrail.Record) => {
//   const region = record.awsRegion;
//   const account = record.recipientAccountId;
//   const key = `${record.eventSource.split('.')[0].toUpperCase()}_${record.eventName}`;

//   switch (key) {
//     case 'EC2_TerminateInstances':
//       return (record.responseElements.instancesSet.items as any[]).map(
//         (item: { instanceId: string; currentState: { code: number }; previousState: { code: number } }) =>
//           ResourceARNs.EC2_Instances(region, account, item.instanceId)
//       );
//     case 'MONITORING_DeleteAlarms':
//       return (record.requestParameters.alarmNames as string[]).map((item) =>
//         ResourceARNs.MONITORING_Alarm(region, account, item)
//       );
//     case 'MONITORING_DeleteDashboards':
//       return (record.requestParameters.dashboardNames as string[]).map((item) =>
//         ResourceARNs.MONITORING_Dashboard(region, account, item)
//       );
//   }

//   return [];
// };
