locals {
  # ----------------------------------------------------------------------------------------------
  # Environment
  # ----------------------------------------------------------------------------------------------
  suffix       = local.remote_setup.suffix
  remote_setup = data.terraform_remote_state.setup.outputs
  account_id   = data.aws_caller_identity.this.account_id
  region       = data.aws_region.this.name

  # ----------------------------------------------------------------------------------------------
  # Project Informations
  # ----------------------------------------------------------------------------------------------
  # domain_prefix   = local.is_dev ? "dev." : ""
  # domain_name     = data.aws_route53_zone.this.name
  project_name    = local.remote_setup.project_name
  project_name_uc = local.remote_setup.project_name_uc
  # dynamodb_tables = local.remote_setup.dynamodb_tables
  # s3_buckets      = local.remote_setup.s3_buckets

  # ----------------------------------------------------------------------------------------------
  # DynamoDB
  # ----------------------------------------------------------------------------------------------
  # dynamodb_name_notification = local.remote_setup.dynamodb_name_notification
  dynamodb_name_event_type   = local.remote_setup.dynamodb_name_event_type
  dynamodb_name_resource     = local.remote_setup.dynamodb_name_resource
  dynamodb_name_unprocessed  = local.remote_setup.dynamodb_name_unprocessed
  dynamodb_name_history      = local.remote_setup.dynamodb_name_history
  dynamodb_name_announcement = local.remote_setup.dynamodb_name_announcement
  dynamodb_name_users        = local.remote_setup.dynamodb_name_users
  dynamodb_name_settings     = local.remote_setup.dynamodb_name_settings

  # ----------------------------------------------------------------------------------------------
  # ECS
  # ----------------------------------------------------------------------------------------------
  task_def_family_auth     = "${local.project_name}-auth"
  task_def_family_token    = "${local.project_name}-token"
  task_def_family_user     = "${local.project_name}-user"
  task_def_family_resource = "${local.project_name}-resource"

  task_def_rev_auth     = max(aws_ecs_task_definition.auth.revision, data.aws_ecs_task_definition.auth.revision)
  task_def_rev_token    = max(aws_ecs_task_definition.token.revision, data.aws_ecs_task_definition.token.revision)
  task_def_rev_user     = max(aws_ecs_task_definition.user.revision, data.aws_ecs_task_definition.user.revision)
  task_def_rev_resource = max(aws_ecs_task_definition.resource.revision, data.aws_ecs_task_definition.resource.revision)

  # ----------------------------------------------------------------------------------------------
  # CloudFront
  # ----------------------------------------------------------------------------------------------
  origin_id_frontend     = "frontend"
  default_root_object    = "index.html"
  viewer_protocol_policy = "redirect-to-https"

  # ----------------------------------------------------------------------------------------------
  # S3 Bucket
  # ----------------------------------------------------------------------------------------------
  bucket_name_frontend    = local.remote_setup.bucket_name_frontend
  bucket_name_environment = local.remote_setup.bucket_name_environment

  # ----------------------------------------------------------------------------------------------
  # Route53
  # ----------------------------------------------------------------------------------------------
  route53_zone_name = local.remote_setup.route53_zone_name
  domain_name       = local.remote_setup.route53_zone_name
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
# Amazon S3 Bucket - Frontend
# ----------------------------------------------------------------------------------------------
data "aws_s3_bucket" "frontend" {
  bucket = local.bucket_name_frontend
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Environment
# ----------------------------------------------------------------------------------------------
data "aws_s3_bucket" "environment" {
  bucket = local.bucket_name_environment
}

# ----------------------------------------------------------------------------------------------
# ECS Task Definition
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "auth" {
  depends_on      = [aws_ecs_task_definition.auth]
  task_definition = aws_ecs_task_definition.auth.family
}

# ----------------------------------------------------------------------------------------------
# ECS Task Definition
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "token" {
  depends_on      = [aws_ecs_task_definition.token]
  task_definition = aws_ecs_task_definition.token.family
}

# ----------------------------------------------------------------------------------------------
# ECS Task Definition
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "user" {
  depends_on      = [aws_ecs_task_definition.user]
  task_definition = aws_ecs_task_definition.user.family
}

# ----------------------------------------------------------------------------------------------
# ECS Task Definition
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "resource" {
  depends_on      = [aws_ecs_task_definition.resource]
  task_definition = aws_ecs_task_definition.resource.family
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Auth manager repository url
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "auth_repo_url" {
  depends_on = [aws_ssm_parameter.auth_repo_url]
  name       = aws_ssm_parameter.auth_repo_url.name
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Token manager repository url
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "token_repo_url" {
  depends_on = [aws_ssm_parameter.token_repo_url]
  name       = aws_ssm_parameter.token_repo_url.name
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - User manager repository url
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "user_repo_url" {
  depends_on = [aws_ssm_parameter.user_repo_url]
  name       = aws_ssm_parameter.user_repo_url.name
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Resource manager repository url
# ----------------------------------------------------------------------------------------------
data "aws_ssm_parameter" "resource_repo_url" {
  depends_on = [aws_ssm_parameter.resource_repo_url]
  name       = aws_ssm_parameter.resource_repo_url.name
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Settings
# ----------------------------------------------------------------------------------------------
data "aws_dynamodb_table" "settings" {
  name = local.dynamodb_name_settings
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Users
# ----------------------------------------------------------------------------------------------
data "aws_dynamodb_table" "users" {
  name = local.dynamodb_name_users
}

# ----------------------------------------------------------------------------------------------
# AWS Route53 Zone
# ----------------------------------------------------------------------------------------------
data "aws_route53_zone" "this" {
  name = local.route53_zone_name
}
