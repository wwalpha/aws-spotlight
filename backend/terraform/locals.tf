locals {
  # ----------------------------------------------------------------------------------------------
  # Environment
  # ----------------------------------------------------------------------------------------------
  suffix          = local.remote_setup.suffix
  remote_setup    = data.terraform_remote_state.setup.outputs
  remote_services = data.terraform_remote_state.services.outputs
  account_id      = data.aws_caller_identity.this.account_id
  region          = data.aws_region.this.name

  # ----------------------------------------------------------------------------------------------
  # Project Informations
  # ----------------------------------------------------------------------------------------------
  project_name    = local.remote_setup.project_name
  project_name_uc = local.remote_setup.project_name_uc

  # ----------------------------------------------------------------------------------------------
  # Lambda
  # ----------------------------------------------------------------------------------------------
  lambda_handler          = "index.handler"
  lambda_runtime          = "nodejs20.x"
  lambda_basic_policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

  # ----------------------------------------------------------------------------------------------
  # API Gateway
  # ----------------------------------------------------------------------------------------------
  apigateway_id                   = local.remote_services.apigateway_id
  apigateway_execution_arn        = local.remote_services.apigateway_execution_arn
  apigateway_domain_name          = local.remote_services.apigateway_domain_name
  apigateway_authorizer_id        = local.remote_services.apigateway_authorizer_id
  apigateway_integration_auth     = local.remote_services.apigateway_integration_auth
  apigateway_integration_resource = local.remote_services.apigateway_integration_resource
  apigateway_integration_token    = local.remote_services.apigateway_integration_token
  apigateway_integration_user     = local.remote_services.apigateway_integration_user

  # ----------------------------------------------------------------------------------------------
  # DynamoDB
  # ----------------------------------------------------------------------------------------------
  dynamodb_name_event_type  = local.remote_setup.dynamodb_name_event_type
  dynamodb_name_events      = local.remote_setup.dynamodb_name_events
  dynamodb_name_resources   = local.remote_setup.dynamodb_name_resources
  dynamodb_name_raw         = local.remote_setup.dynamodb_name_raw
  dynamodb_name_unprocessed = local.remote_setup.dynamodb_name_unprocessed
  dynamodb_name_history     = local.remote_setup.dynamodb_name_history
  dynamodb_name_users       = local.remote_setup.dynamodb_name_users
  dynamodb_name_settings    = local.remote_setup.dynamodb_name_settings

  # ----------------------------------------------------------------------------------------------
  # CloudMap
  # ----------------------------------------------------------------------------------------------
  cloudmap_namespace     = local.remote_services.cloudmap_namespace
  cloudmap_service_auth  = local.remote_services.cloudmap_service_auth
  cloudmap_service_user  = local.remote_services.cloudmap_service_user
  cloudmap_service_token = local.remote_services.cloudmap_service_token

  # ----------------------------------------------------------------------------------------------
  # S3
  # ----------------------------------------------------------------------------------------------
  bucket_name_environment = local.remote_setup.bucket_name_environment
  bucket_name_archive     = local.remote_setup.bucket_name_archive

  bucket_key_lambda_filtering_raw    = local.remote_services.bucket_key_lambda_filtering_raw
  bucket_key_lambda_filtering_events = local.remote_services.bucket_key_lambda_filtering_events
  bucket_key_lambda_streaming        = local.remote_services.bucket_key_lambda_streaming
  bucket_key_lambda_libraries        = local.remote_services.bucket_key_lambda_libraries

  # ----------------------------------------------------------------------------------------------
  # ECR
  # ----------------------------------------------------------------------------------------------
  ecr_repository_cloudtrail  = local.remote_services.ecr_repository_cloudtrail
  ecr_repository_unprocessed = local.remote_services.ecr_repository_unprocessed

  # ----------------------------------------------------------------------------------------------
  # SNS
  # ----------------------------------------------------------------------------------------------
  sns_topic_name_admin            = local.remote_services.sns_topic_name_admin
  sns_topic_name_filtering_events = local.remote_services.sns_topic_name_filtering_events
  sns_topic_name_cloudtrail       = local.remote_services.sns_topic_name_cloudtrail

  # ----------------------------------------------------------------------------------------------
  # SQS
  # ----------------------------------------------------------------------------------------------
  sqs_name_cloudtrail       = local.remote_services.sqs_name_cloudtrail
  sqs_name_filtering_raw    = local.remote_services.sqs_name_filtering_raw
  sqs_name_filtering_events = local.remote_services.sqs_name_filtering_events
}

# ----------------------------------------------------------------------------------------------
# AWS Region
# ----------------------------------------------------------------------------------------------
data "aws_region" "this" {}

# ----------------------------------------------------------------------------------------------
# AWS Account
# ----------------------------------------------------------------------------------------------
data "aws_caller_identity" "this" {}

# ----------------------------------------------------------------------------------------------
# AWS SQS Queue
# ----------------------------------------------------------------------------------------------
data "aws_sqs_queue" "cloudtrail" {
  name = local.sqs_name_cloudtrail
}

# ----------------------------------------------------------------------------------------------
# AWS SQS Queue
# ----------------------------------------------------------------------------------------------
data "aws_sqs_queue" "filtering_raw" {
  name = local.sqs_name_filtering_raw
}

# ----------------------------------------------------------------------------------------------
# AWS SQS Queue
# ----------------------------------------------------------------------------------------------
data "aws_sqs_queue" "filtering_events" {
  name = local.sqs_name_filtering_events
}

# ----------------------------------------------------------------------------------------------
# AWS SNS Topic
# ----------------------------------------------------------------------------------------------
data "aws_sns_topic" "admin" {
  name = local.sns_topic_name_admin
}

# ----------------------------------------------------------------------------------------------
# AWS SNS Topic
# ----------------------------------------------------------------------------------------------
data "aws_sns_topic" "filtering_events" {
  name = local.sns_topic_name_filtering_events
}

# ----------------------------------------------------------------------------------------------
# AWS SNS Topic
# ----------------------------------------------------------------------------------------------
data "aws_sns_topic" "cloudtrail" {
  name = local.sns_topic_name_cloudtrail
}

# ----------------------------------------------------------------------------------------------
# AWS ECR Repository - CloudTrail
# ----------------------------------------------------------------------------------------------
data "aws_ecr_repository" "cloudtrail" {
  name = local.ecr_repository_cloudtrail
}

# ----------------------------------------------------------------------------------------------
# AWS ECR Repository - Unprocessed
# ----------------------------------------------------------------------------------------------
data "aws_ecr_repository" "unprocessed" {
  name = local.ecr_repository_unprocessed
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - CloudTrail repository url
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "cloudtrail_repo_url" {
  depends_on = [aws_ssm_parameter.cloudtrail_repo_url]
  name       = aws_ssm_parameter.cloudtrail_repo_url.name
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Unprocessed repository url
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "unprocessed_repo_url" {
  depends_on = [aws_ssm_parameter.unprocessed_repo_url]
  name       = aws_ssm_parameter.unprocessed_repo_url.name
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda filtering raw module
# ----------------------------------------------------------------------------------------------
data "aws_s3_object" "lambda_filtering_raw" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_filtering_raw
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda filtering events module
# ----------------------------------------------------------------------------------------------
data "aws_s3_object" "lambda_filtering_events" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_filtering_events
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda streaming module
# ----------------------------------------------------------------------------------------------
data "aws_s3_object" "lambda_streaming" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_streaming
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda libraries module
# ----------------------------------------------------------------------------------------------
data "aws_s3_object" "lambda_libraries" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_libraries
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Resources
# ----------------------------------------------------------------------------------------------
data "aws_dynamodb_table" "resources" {
  name = local.dynamodb_name_resources
}
