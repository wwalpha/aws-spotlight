# ----------------------------------------------------------------------------------------------
# VPC Public Subnets
# ----------------------------------------------------------------------------------------------
output "public_subnets" {
  value = module.vpc.public_subnets
}

# ----------------------------------------------------------------------------------------------
# VPC Private Subnets
# ----------------------------------------------------------------------------------------------
output "private_subnets" {
  value = module.vpc.private_subnets
}

# ----------------------------------------------------------------------------------------------
# CloudFront Domain Name
# ----------------------------------------------------------------------------------------------
output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.this.domain_name
}

# ----------------------------------------------------------------------------------------------
# API Gateway Id
# ----------------------------------------------------------------------------------------------
output "apigateway_id" {
  value = aws_apigatewayv2_api.this.id
}

# ----------------------------------------------------------------------------------------------
# API Gateway Execution Arn
# ----------------------------------------------------------------------------------------------
output "apigateway_execution_arn" {
  value = aws_apigatewayv2_api.this.execution_arn
}

# ----------------------------------------------------------------------------------------------
# API Gateway Domain Name
# ----------------------------------------------------------------------------------------------
output "apigateway_domain_name" {
  value = aws_apigatewayv2_stage.this.invoke_url
}

# ----------------------------------------------------------------------------------------------
# API Gateway Domain Name
# ----------------------------------------------------------------------------------------------
output "apigateway_authorizer_id" {
  value = aws_apigatewayv2_authorizer.this.id
}

# ----------------------------------------------------------------------------------------------
# API Gateway Integration Id - Auth
# ----------------------------------------------------------------------------------------------
output "apigateway_integration_auth" {
  value = aws_apigatewayv2_integration.auth.id
}

# ----------------------------------------------------------------------------------------------
# API Gateway Integration Id - Resource
# ----------------------------------------------------------------------------------------------
output "apigateway_integration_resource" {
  value = aws_apigatewayv2_integration.resource.id
}

# ----------------------------------------------------------------------------------------------
# API Gateway Integration Id - Token
# ----------------------------------------------------------------------------------------------
output "apigateway_integration_token" {
  value = aws_apigatewayv2_integration.token.id
}

# ----------------------------------------------------------------------------------------------
# API Gateway Integration Id - User
# ----------------------------------------------------------------------------------------------
output "apigateway_integration_user" {
  value = aws_apigatewayv2_integration.user.id
}

# ----------------------------------------------------------------------------------------------
# SNS Topic Name - Admin
# ----------------------------------------------------------------------------------------------
output "sns_topic_name_admin" {
  value = aws_sns_topic.admin.name
}

# ----------------------------------------------------------------------------------------------
# SQS Name - CloudTrail
# ----------------------------------------------------------------------------------------------
output "sqs_name_cloudtrail" {
  value = aws_sqs_queue.cloudtrail.name
}

# ----------------------------------------------------------------------------------------------
# SQS Name - Filtering
# ----------------------------------------------------------------------------------------------
output "sqs_name_filtering" {
  value = aws_sqs_queue.filtering.name
}

# ----------------------------------------------------------------------------------------------
# SQS URL - DeadLetter
# ----------------------------------------------------------------------------------------------
output "sqs_name_deadletter" {
  value = aws_sqs_queue.deadletter.name
}

# ----------------------------------------------------------------------------------------------
# ECR Repository - Auth
# ----------------------------------------------------------------------------------------------
output "ecr_repository_auth" {
  value = aws_ecr_repository.auth.name
}

# ----------------------------------------------------------------------------------------------
# ECR Repository - Token
# ----------------------------------------------------------------------------------------------
output "ecr_repository_token" {
  value = aws_ecr_repository.token.name
}

# ----------------------------------------------------------------------------------------------
# ECR Repository - CloudTrail
# ----------------------------------------------------------------------------------------------
output "ecr_repository_cloudtrail" {
  value = aws_ecr_repository.cloudtrail.name
}

# ----------------------------------------------------------------------------------------------
# ECR Repository - Filtering
# ----------------------------------------------------------------------------------------------
output "ecr_repository_filtering" {
  value = aws_ecr_repository.filtering.name
}

# ----------------------------------------------------------------------------------------------
# ECR Repository - Unprocessed
# ----------------------------------------------------------------------------------------------
output "ecr_repository_unprocessed" {
  value = aws_ecr_repository.unprocessed.name
}

# ----------------------------------------------------------------------------------------------
# CloudMap - Namespace
# ----------------------------------------------------------------------------------------------
output "cloudmap_namespace" {
  value = aws_service_discovery_private_dns_namespace.this.name
}

# ----------------------------------------------------------------------------------------------
# CloudMap Service - Auth
# ----------------------------------------------------------------------------------------------
output "cloudmap_service_auth" {
  value = aws_service_discovery_service.auth.name
}

# ----------------------------------------------------------------------------------------------
# CloudMap Service - User
# ----------------------------------------------------------------------------------------------
output "cloudmap_service_user" {
  value = aws_service_discovery_service.user.name
}

# ----------------------------------------------------------------------------------------------
# CloudMap Service - Token
# ----------------------------------------------------------------------------------------------
output "cloudmap_service_token" {
  value = aws_service_discovery_service.token.name
}

# ----------------------------------------------------------------------------------------------
# Lambda module bucket key - Filtering
# ----------------------------------------------------------------------------------------------
output "bucket_key_lambda_filtering" {
  value = local.bucket_key_lambda_filtering
}
