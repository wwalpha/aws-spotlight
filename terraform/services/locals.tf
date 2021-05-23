locals {
  # ----------------------------------------------------------------------------------------------
  # Environment
  # ----------------------------------------------------------------------------------------------
  environment  = terraform.workspace
  is_dev       = local.environment == "dev"
  remote_setup = data.terraform_remote_state.setup.outputs
  account_id   = data.aws_caller_identity.this.account_id
  region       = data.aws_region.this.name
  region_us    = "us-east-1"

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
  # ECS
  # ----------------------------------------------------------------------------------------------
  task_def_family_auth     = "${local.project_name}-auth"
  task_def_family_resource = "${local.project_name}-resource"

  task_def_rev_auth     = max(aws_ecs_task_definition.auth.revision, data.aws_ecs_task_definition.auth.revision)
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
  bucket_name_frontend = local.remote_setup.bucket_name_frontend

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
# ECS Task Definition
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "auth" {
  depends_on      = [aws_ecs_task_definition.auth]
  task_definition = aws_ecs_task_definition.auth.family
}

# ----------------------------------------------------------------------------------------------
# ECS Task Definition
# ----------------------------------------------------------------------------------------------
data "aws_ecs_task_definition" "resource" {
  depends_on      = [aws_ecs_task_definition.resource]
  task_definition = aws_ecs_task_definition.resource.family
}
