export const ResourceARNs = {
  // apigateway api
  APIGATEWAY_Api: (region: string, _: string, id?: string) => `arn:aws:apigateway:${region}::/apis/${id}`,

  // apigateway vpclink
  APIGATEWAY_VpcLink: (region: string, _: string, id?: string) => `arn:aws:apigateway:${region}::/vpclinks/${id}`,

  // redshift
  REDSHIFT_Cluster: (region: string, account?: string, id?: string) =>
    `arn:aws:redshift:${region}:${account}:cluster:${id}`,

  // monitoring
  MONITORING_Alarms: (region: string, account?: string, id?: string) =>
    `arn:aws:cloudwatch:${region}:${account}:alarm:${id}`,

  // cloudwatch logs
  LOGS_LogGroup: (region: string, account?: string, id?: string) => `arn:aws:logs:${region}:${account}:log-group:${id}`,

  // lex
  LEX_Bot: (region: string, account?: string, id?: string) => `arn:aws:lex:${region}:${account}:bot:${id}`,

  // lambda
  LAMBDA_Function20150331: (region: string, account?: string, id?: string) =>
    `arn:aws:lambda:${region}:${account}:function:${id}`,

  // kinesis
  KINESIS_Stream: (region: string, account?: string, id?: string) =>
    `arn:aws:kinesis:${region}:${account}:stream/${id}`,

  // iot
  IOT_TopicRule: (region: string, account?: string, id?: string) => `arn:aws:iot:${region}:${account}:rule/${id}`,

  // glue
  GLUE_Database: (region: string, account?: string, id?: string) => `arn:aws:glue:${region}:${account}:database/${id}`,

  // firehose
  FIREHOSE_DeliveryStream: (region: string, account?: string, id?: string) =>
    `arn:aws:firehose:${region}:${account}:deliverystream/${id}`,

  // events
  EVENTS_Rule: (region: string, account?: string, id?: string) => `arn:aws:events:${region}:${account}:rule/${id}`,

  // elasticfilesystem
  ELASTICFILESYSTEM_FileSystem: (region: string, account?: string, id?: string) =>
    `arn:aws:elasticfilesystem:${region}:${account}:file-system/${id}`,

  // ds
  DS_Directory: (region: string, account?: string, id?: string) =>
    `arn:aws:clouddirectory:${region}:${account}:directory/${id}`,

  // codedeploy
  CODEDEPLOY_Application: (region: string, account?: string, id?: string) =>
    `arn:aws:codedeploy:${region}:${account}:application/${id}`,

  // cloudfront
  CLOUDFRONT_Distribution: (_: string, account?: string, id?: string) =>
    `arn:aws:cloudfront::${account}:distribution/${id}`,

  // autoscaling
  AUTOSCALING_AutoScalingGroup: (region: string, account?: string, id?: string) =>
    `arn:aws:autoscaling:${region}:${account}:autoScalingGroup:*:autoScalingGroupName/${id}`,

  // route53
  ROUTE53_HostedZone: (_: string, __?: string, id?: string) => `arn:aws:route53:::hostedzone/${id}`,

  // s3
  S3_Bucket: (_: string, __?: string, id?: string) => `arn:aws:s3:::${id}`,

  // sqs
  SQS_Queue: (region: string, account?: string, id?: string) => `arn:aws:sqs:${region}:${account}:${id}`,

  // sqs
  SYNTHETICS_Canary: (region: string, account?: string, id?: string) =>
    `arn:aws:synthetics:${region}:${account}:canary:${id}`,

  // timestream
  TIMESTREAM_Database: (region: string, account?: string, id?: string) =>
    `arn:aws:timestream:${region}:${account}:database/${id}`,

  // transfer
  TRANSFER_Server: (region: string, account?: string, id?: string) =>
    `arn:aws:transfer:${region}:${account}:server/${id}`,

  // wafv2 ipset
  WAFV2_IPSet: (region: string, account?: string, id?: string) => `arn:aws:wafv2:${region}:${account}:${id}`,

  // wafv2 webacl
  WAFV2_WebACL: (region: string, account?: string, id?: string) => `arn:aws:wafv2:${region}:${account}:${id}`,

  // rds cluster parameter group
  RDS_DBClusterParameterGroup: (region: string, account?: string, id?: string) =>
    `arn:aws:rds:${region}:${account}:cluster-pg:${id}`,

  // rds parameter group
  RDS_DBParameterGroup: (region: string, account?: string, id?: string) => `arn:aws:rds:${region}:${account}:pg:${id}`,

  // rds db snapshot
  RDS_DBSnapshot: (region: string, account?: string, id?: string) => `arn:aws:rds:${region}:${account}:snapshot:${id}`,

  // rds db subnet group
  RDS_DBSubnetGroup: (region: string, account?: string, id?: string) => `arn:aws:rds:${region}:${account}:subgrp:${id}`,

  // elasticache subnet group
  ELASTICACHE_CacheSubnetGroup: (region: string, account?: string, id?: string) =>
    `arn:aws:elasticache:${region}:${account}:subnetgroup:${id}`,
};
