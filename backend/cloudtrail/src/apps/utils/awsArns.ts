export const ResourceARNs = {
  // apigateway api
  APIGATEWAY_Api: (region: string, _: string, id?: string) => `arn:aws:apigateway:${region}::/apis/${id}`,

  // apigateway domain
  APIGATEWAY_DomainName: (region: string, _: string, id?: string) => `arn:aws:apigateway:${region}::/domainnames/${id}`,

  // apigateway vpclink
  APIGATEWAY_VpcLink: (region: string, _: string, id?: string) => `arn:aws:apigateway:${region}::/vpclinks/${id}`,

  // autoscaling
  AUTOSCALING_AutoScalingGroup: (region: string, account: string, id?: string) =>
    `arn:aws:autoscaling:${region}:${account}:autoScalingGroup:*:autoScalingGroupName/${id}`,

  // batch compute environment
  BATCH_COMPUTE_ENVIRONMENT: (region: string, account: string, id?: string) =>
    `arn:aws:batch:${region}:${account}:compute-environment/${id}`,

  // redshift
  REDSHIFT_Cluster: (region: string, account: string, id?: string) =>
    `arn:aws:redshift:${region}:${account}:cluster:${id}`,

  // monitoring
  MONITORING_Dashboard: (_: string, account: string, id?: string) => `arn:aws:cloudwatch::${account}:dashboard/${id}`,

  // monitoring
  MONITORING_Alarm: (region: string, account: string, id?: string) =>
    `arn:aws:cloudwatch:${region}:${account}:alarm:${id}`,

  // cloudwatch logs
  LOGS_LogGroup: (region: string, account: string, id?: string) => `arn:aws:logs:${region}:${account}:log-group:${id}`,

  // lex
  LEX_Bot: (region: string, account: string, id?: string) => `arn:aws:lex:${region}:${account}:bot:${id}`,

  // lambda
  LAMBDA_Function20150331: (region: string, account: string, id?: string) =>
    `arn:aws:lambda:${region}:${account}:function:${id}`,

  // amazon mq
  AMAZONMQ_Broker: (region: string, account: string, id?: string) => `arn:aws:mq:${region}:${account}:broker:${id}`,

  // KENDRA
  KENDRA_Index: (region: string, account: string, id?: string) => `arn:aws:kendra:${region}:${account}:index/${id}`,

  // kinesis
  KINESIS_Stream: (region: string, account: string, id?: string) => `arn:aws:kinesis:${region}:${account}:stream/${id}`,

  // kinesis analytics
  KINESISANALYTICS_Application: (region: string, account: string, id?: string) =>
    `arn:aws:kinesisanalytics:${region}:${account}:application/${id}`,

  // iot
  IOT_TopicRule: (region: string, account: string, id?: string) => `arn:aws:iot:${region}:${account}:rule/${id}`,

  // glue
  GLUE_Database: (region: string, account: string, id?: string) => `arn:aws:glue:${region}:${account}:database/${id}`,

  // firehose
  FIREHOSE_DeliveryStream: (region: string, account: string, id?: string) =>
    `arn:aws:firehose:${region}:${account}:deliverystream/${id}`,

  // fsx
  FSX_FileSystem: (region: string, account: string, id?: string) =>
    `arn:aws:fsx:${region}:${account}:file-system/${id}`,

  // events
  EVENTS_Rule: (region: string, account: string, id?: string) => `arn:aws:events:${region}:${account}:rule/${id}`,

  // elasticfilesystem
  ELASTICFILESYSTEM_FileSystem: (region: string, account: string, id?: string) =>
    `arn:aws:elasticfilesystem:${region}:${account}:file-system/${id}`,

  // elasticloadbalancing
  ELASTICLOADBALANCING_LoadBalancer: (region: string, account: string, id?: string) =>
    `arn:aws:elasticloadbalancing:${region}:${account}:loadbalancer/${id}`,

  // ds
  DS_Directory: (region: string, account: string, id?: string) =>
    `arn:aws:clouddirectory:${region}:${account}:directory/${id}`,

  // dms
  DMS_ReplicationInstance: (region: string, account: string, id?: string) =>
    `arn:aws:dms:${region}:${account}:rep/${id}`,

  // codecommit
  CODECOMMIT_Repository: (region: string, account: string, id?: string) =>
    `arn:aws:codecommit:${region}:${account}:${id}`,

  // codedeploy
  CODEDEPLOY_Application: (region: string, account: string, id?: string) =>
    `arn:aws:codedeploy:${region}:${account}:application/${id}`,

  // cognito
  COGNITO_USERPOOL: (region: string, account: string, id?: string) =>
    `arn:aws:cognito-idp:${region}:${account}:userpool/${id}`,

  COGNITO_IDENTITYPOOL: (region: string, account: string, id?: string) =>
    `arn:aws:cognito-identity:${region}:${account}:identitypool/${id}`,

  // cloud9
  CLOUD9_Environment: (region: string, account: string, id: string) =>
    `arn:aws:cloud9:${region}:${account}:environment:${id}`,

  // cloudformation
  CLOUDFORMATION_Stack: (region: string, account: string, stackName: string) =>
    `arn:aws:cloudformation:${region}:${account}:stack/${stackName}`,

  // cloudfront
  CLOUDFRONT_Distribution: (_: string, account: string, id?: string) =>
    `arn:aws:cloudfront::${account}:distribution/${id}`,

  CLOUDFRONT_Function: (_: string, account: string, id?: string) => `arn:aws:cloudfront::${account}:function/${id}`,

  // connect
  CONNECT_Instance: (region: string, account: string, id?: string) =>
    `arn:aws:connect:${region}:${account}:instance/${id}`,

  // route53
  ROUTE53_HostedZone: (id: string) => `arn:aws:route53:::hostedzone/${id}`,

  // servicediscovery
  SERVICEDISCOVERY_Namespace: (region: string, account: string, id?: string) =>
    `arn:aws:servicediscovery:${region}:${account}:namespace/${id}`,

  // s3
  S3_Bucket: (_: string, __?: string, id?: string) => `arn:aws:s3:::${id}`,

  // sagemaker
  SAGEMAKER_Domain: (region: string, account: string, id?: string) =>
    `arn:aws:sagemaker:${region}:${account}:domain/${id}`,

  // scheduler
  SCHEDULER_Schedule: (region: string, account: string, id?: string) =>
    `arn:aws:scheduler:${region}:${account}:schedule/default/${id}`,

  // sqs
  SQS_Queue: (region: string, account: string, id?: string) => `arn:aws:sqs:${region}:${account}:${id}`,

  // sqs
  SYNTHETICS_Canary: (region: string, account: string, id?: string) =>
    `arn:aws:synthetics:${region}:${account}:canary:${id}`,

  // timestream
  TIMESTREAM_Database: (region: string, account: string, id?: string) =>
    `arn:aws:timestream:${region}:${account}:database/${id}`,

  // transfer
  TRANSFER_Server: (region: string, account: string, id?: string) =>
    `arn:aws:transfer:${region}:${account}:server/${id}`,

  // wafv2 ipset
  WAFV2_IPSet: (region: string, account: string, id?: string) => `arn:aws:wafv2:${region}:${account}:${id}`,

  // wafv2 webacl
  WAFV2_WebACL: (region: string, account: string, id?: string) => `arn:aws:wafv2:${region}:${account}:${id}`,

  // rds cluster parameter group
  RDS_DBClusterParameterGroup: (region: string, account: string, id?: string) =>
    `arn:aws:rds:${region}:${account}:cluster-pg:${id}`,

  // rds parameter group
  RDS_DBParameterGroup: (region: string, account: string, id?: string) => `arn:aws:rds:${region}:${account}:pg:${id}`,

  // rds db snapshot
  RDS_DBSnapshot: (region: string, account: string, id?: string) => `arn:aws:rds:${region}:${account}:snapshot:${id}`,

  // rds db subnet group
  RDS_DBSubnetGroup: (region: string, account: string, id?: string) => `arn:aws:rds:${region}:${account}:subgrp:${id}`,

  // rds db option group
  RDS_DBOptionGroup: (region: string, account: string, id?: string) => `arn:aws:rds:${region}:${account}:og:${id}`,

  // rds db instance
  RDS_DBInstance: (region: string, account: string, id?: string) => `arn:aws:rds:${region}:${account}:db:${id}`,

  // elasticache subnet group
  ELASTICACHE_CacheSubnetGroup: (region: string, account: string, id?: string) =>
    `arn:aws:elasticache:${region}:${account}:subnetgroup:${id}`,

  // iam
  IAM_Role: (_: string, account: string, id?: string) => `arn:aws:iam::${account}:role/${id}`,

  // iam
  IAM_User: (_: string, account: string, id?: string) => `arn:aws:iam::${account}:user/${id}`,

  // ec2 client vpn endpoint
  EC2_ClientVpnEndpoint: (region: string, account: string, id?: string) =>
    `arn:aws:ec2:${region}:${account}:client-vpn-endpoint/${id}`,

  // ec2 customer gateway
  EC2_CustomerGateway: (region: string, account: string, id?: string) =>
    `arn:aws:ec2:${region}:${account}:customer-gateway/${id}`,

  // ec2 internet gateway
  EC2_InternetGateway: (region: string, account: string, id?: string) =>
    `arn:aws:ec2:${region}:${account}:internet-gateway/${id}`,

  // ec2 launch template
  EC2_LaunchTemplate: (region: string, account: string, id?: string) =>
    `arn:aws:ec2:${region}:${account}:launch-template/${id}`,

  // ec2 nat gateway
  EC2_NatGateway: (region: string, account: string, id?: string) => `arn:aws:ec2:${region}:${account}:natgateway/${id}`,

  // ec2 network insights path
  EC2_NetworkInsightsPath: (region: string, account: string, id?: string) =>
    `arn:aws:ec2:${region}:${account}:network-insights-path/${id}`,

  // ec2 security group
  EC2_SecurityGroup: (region: string, account: string, id?: string) =>
    `arn:aws:ec2:${region}:${account}:security-group/${id}`,

  // ec2 route table
  EC2_RouteTable: (region: string, account: string, id?: string) =>
    `arn:aws:ec2:${region}:${account}:route-table/${id}`,

  // ec2 snapshot
  EC2_Snapshot: (region: string, _: string, id?: string) => `arn:aws:ec2:${region}::snapshot/${id}`,

  // ec2 subnet
  EC2_Subnet: (region: string, account: string, id?: string) => `arn:aws:ec2:${region}:${account}:subnet/${id}`,

  // ec2 transit gateway
  EC2_TransitGateway: (region: string, account: string, id?: string) =>
    `arn:aws:ec2:${region}:${account}:transit-gateway/${id}`,

  // ec2 transit gateway Route Table
  EC2_TransitGatewayRouteTable: (region: string, account: string, id?: string) =>
    `arn:aws:ec2:${region}:${account}:transit-gateway-route-table/${id}`,

  // ec2 volumn
  EC2_Volume: (region: string, account: string, id?: string) => `arn:aws:ec2:${region}:${account}:volume/${id}`,

  // ec2 vpc
  EC2_Vpc: (region: string, account: string, id?: string) => `arn:aws:ec2:${region}:${account}:vpc/${id}`,

  // ec2 vpc endpoint
  EC2_VpcEndpoints: (region: string, account: string, id?: string) =>
    `arn:aws:ec2:${region}:${account}:vpc-endpoint/${id}`,

  // ec2 vpc peering
  EC2_VpcPeeringConnection: (region: string, account: string, id?: string) =>
    `arn:aws:ec2:${region}:${account}:vpc-peering-connection/${id}`,

  // ec2 vpn connection
  EC2_VpnConnection: (region: string, account: string, id?: string) =>
    `arn:aws:ec2:${region}:${account}:vpn-connection/${id}`,

  // ec2 vpn gateway
  EC2_VpnGateway: (region: string, account: string, id?: string) =>
    `arn:aws:ec2:${region}:${account}:vpn-gateway/${id}`,

  // ec2 deregister image
  EC2_Image: (region: string, _: string, id?: string) => `arn:aws:ec2:${region}::image/${id}`,

  // ec2 release address
  EC2_IPAddress: (region: string, account: string, id?: string) => `arn:aws:ec2:${region}:${account}:elastic-ip/${id}`,

  // ec2 release address
  EC2_Instances: (region: string, account: string, id?: string) => `arn:aws:ec2:${region}:${account}:instance/${id}`,

  // backup vault
  BACKUP_BackupVault: (region: string, account: string, id?: string) =>
    `arn:aws:backup:${region}:${account}:backup-vault:${id}`,
};
