import { ResourceARNs } from '@src/apps/utils/awsArns';
import { CloudTrail, Tables } from 'typings';

export const start = (record: CloudTrail.Record): Tables.ResouceGSI1Key => {
  return {
    EventSource: record.eventSource,
    ResourceId: getResourceArn(record),
  };
};

const getResourceArn = (record: CloudTrail.Record) => {
  const region = record.awsRegion;
  const account = record.recipientAccountId;
  const key = `${record.eventSource.split('.')[0].toUpperCase()}_${record.eventName}`;

  switch (key) {
    case 'APIGATEWAY_DeleteApi':
      return ResourceARNs.APIGATEWAY_Api(region, account, record.requestParameters.restApiId);
    case 'APIGATEWAY_DeleteRestApi':
      return ResourceARNs.APIGATEWAY_Api(region, account, record.requestParameters.restApiId);
    case 'APIGATEWAY_DeleteVpcLink':
      return ResourceARNs.APIGATEWAY_VpcLink(region, account, record.requestParameters.vpcLinkId);
    case 'APPMESH_DeleteMesh':
      return record.responseElements.mesh.metadata.arn;
    case 'AUTOSCALING_DeleteAutoScalingGroup':
      return ResourceARNs.AUTOSCALING_AutoScalingGroup(region, account, record.requestParameters.autoScalingGroupName);

    case 'BATCH_DeleteComputeEnvironment':
      return record.requestParameters.computeEnvironment;

    case 'CONNECT_DeleteInstance':
      return decodeURIComponent(record.requestParameters.InstanceId);
    case 'CODEDEPLOY_DeleteApplication':
      return ResourceARNs.CODEDEPLOY_Application(region, account, record.requestParameters.applicationName);
    case 'CODEBUILD_DeleteProject':
      return record.requestParameters.name;
    case 'CLOUDFORMATION_DeleteStack':
      return record.requestParameters.stackName;
    case 'CLOUDFRONT_DeleteDistribution':
      return ResourceARNs.CLOUDFRONT_Distribution(region, account, record.requestParameters.id);

    case 'DYNAMODB_DeleteTable':
      return record.responseElements.tableDescription.tableArn;
    case 'DS_DeleteDirectory':
      return ResourceARNs.DS_Directory(region, account, record.responseElements.directoryId);
    case 'DMS_DeleteReplicationInstance':
      return record.responseElements.replicationInstance.replicationInstanceArn;

    case 'EVENTS_DeleteRule':
      return ResourceARNs.EVENTS_Rule(region, account, record.requestParameters.name);
    case 'ES_DeleteElasticsearchDomain':
      return record.responseElements.domainStatus.aRN;
    case 'ELASTICFILESYSTEM_DeleteFileSystem':
      return ResourceARNs.ELASTICFILESYSTEM_FileSystem(region, account, record.requestParameters.fileSystemId);
    case 'EKS_DeleteCluster':
      return record.responseElements.cluster.arn;
    case 'ECS_DeleteCluster':
      return record.responseElements.cluster.clusterArn;
    case 'ECR_DeleteRepository':
      return record.responseElements.repository.repositoryArn;

    case 'FIREHOSE_DeleteDeliveryStream':
      return ResourceARNs.FIREHOSE_DeliveryStream(region, account, record.requestParameters.deliveryStreamName);
    case 'GLUE_DeleteDatabase':
      return ResourceARNs.GLUE_Database(region, account, record.requestParameters.name);
    case 'IOT_DeleteTopicRule':
      return ResourceARNs.IOT_TopicRule(region, account, record.requestParameters.ruleName);

    case 'KINESIS_DeleteStream':
      return ResourceARNs.KINESIS_Stream(region, account, record.requestParameters.streamName);

    case 'LOGS_DeleteLogGroup':
      return ResourceARNs.LOGS_LogGroup(region, account, record.requestParameters.logGroupName);
    case 'LEX_DeleteBot':
      return ResourceARNs.LEX_Bot(region, account, record.requestParameters.name);
    case 'LAMBDA_DeleteFunction20150331':
      return ResourceARNs.LAMBDA_Function20150331(region, account, record.requestParameters.functionName);

    case 'MONITORING_DeleteAlarms':
      return ResourceARNs.MONITORING_Alarms(region, account, record.recipientAccountId);

    case 'NFW_DeleteFirewall':
      return record.responseElements.firewall.firewallArn;

    case 'REDSHIFT_DeleteCluster':
      return ResourceARNs.REDSHIFT_Cluster(region, account, record.responseElements.clusterIdentifier);
    case 'ROUTE53_DeleteHostedZone':
      return ResourceARNs.ROUTE53_HostedZone(region, account, record.requestParameters.id);
    case 'RDS_DeleteDBCluster':
      return record.responseElements.dBClusterArn;
    case 'RDS_DeleteDBClusterParameterGroup':
      return ResourceARNs.RDS_DBClusterParameterGroup(
        region,
        account,
        record.requestParameters.dBClusterParameterGroupName
      );
    case 'RDS_DeleteDBInstance':
      return record.responseElements.dBInstanceArn;
    case 'RDS_DeleteDBParameterGroup':
      return ResourceARNs.RDS_DBParameterGroup(region, account, record.requestParameters.dBParameterGroupName);
    case 'RDS_DeleteDBProxy':
      return record.responseElements.dBProxy.dBProxyArn;
    case 'RDS_DeleteDBSnapshot':
      return ResourceARNs.RDS_DBSnapshot(region, account, record.requestParameters.dBClusterParameterGroupName);
    case 'RDS_DeleteDBSubnetGroup':
      return ResourceARNs.RDS_DBSubnetGroup(region, account, record.requestParameters.dBSubnetGroupName);

    case 'S3_DeleteBucket':
      return ResourceARNs.S3_Bucket(region, account, record.requestParameters.bucketName);
    case 'SNS_DeleteTopic':
      return record.requestParameters.topicArn;
    case 'SQS_DeleteQueue':
      const queueUrl: string = record.requestParameters.queueUrl;
      const queueName = queueUrl.split('/')[queueUrl.split('/').length - 1];
      return ResourceARNs.SQS_Queue(region, account, queueName);
    case 'STATES_DeleteStateMachine':
      return record.requestParameters.stateMachineArn;
    case 'SYNTHETICS_DeleteCanary':
      return ResourceARNs.SYNTHETICS_Canary(region, account, record.requestParameters.name);

    case 'TIMESTREAM_DeleteDatabase':
      return ResourceARNs.TIMESTREAM_Database(region, account, record.requestParameters.databaseName);
    case 'TRANSFER_DeleteServer':
      return ResourceARNs.TRANSFER_Server(region, account, record.requestParameters.serverId);

    case 'WAFV2_DeleteIPSet':
      return ResourceARNs.WAFV2_IPSet(
        region,
        account,
        `${(record.requestParameters.scope as string).toLowerCase()}/ipset/${record.requestParameters.name}/${
          record.requestParameters.id
        }`
      );
    case 'WAFV2_DeleteWebACL':
      return ResourceARNs.WAFV2_WebACL(
        region,
        account,
        `${(record.requestParameters.scope as string).toLowerCase()}/webacl/${record.requestParameters.name}/${
          record.requestParameters.id
        }`
      );

    case 'ELASTICACHE_DeleteCacheCluster':
      return record.responseElements.aRN;
    case 'ELASTICACHE_DeleteCacheSubnetGroup':
      return ResourceARNs.ELASTICACHE_CacheSubnetGroup(region, account, record.requestParameters.cacheSubnetGroupName);

    case 'ELASTICLOADBALANCING_DeleteLoadBalancer':
      return record.requestParameters.loadBalancerArn;
    case 'ELASTICLOADBALANCING_DeleteTargetGroup':
      return record.requestParameters.targetGroupArn;
  }

  return undefined;
};
