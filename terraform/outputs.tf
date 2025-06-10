output "ecr_repository_url" {
  value = aws_ecr_repository.cloudtrail.repository_url
}

output "lambda_function_name_cloudtrail_process" {
  value = aws_lambda_function.cloudtrail_process.function_name
}

output "lambda_function_name_daily_batch" {
  value = aws_lambda_function.daily_batch.function_name
}

output "lambda_function_name_report" {
  value = aws_lambda_function.report.function_name
}

output "api_key" {
  value     = aws_api_gateway_api_key.this.value
  sensitive = true
}

output "api_url" {
  value = "${aws_api_gateway_stage.this.invoke_url}/report"
}

# ----------------------------------------------------------------------------------------------
# Cognito User Pool Client ID
# ----------------------------------------------------------------------------------------------
output "cognito_user_pool_client_id" {
  value       = awscc_cognito_user_pool_client.this.id
  description = "Cognito User Pool Client ID"
}

# ----------------------------------------------------------------------------------------------
# Cognito User Pool ID
# ----------------------------------------------------------------------------------------------
output "cognito_user_pool_id" {
  value       = aws_cognito_user_pool.this.id
  description = "Cognito User Pool ID"
}

# ----------------------------------------------------------------------------------------------
# Cognito User Pool ID
# ----------------------------------------------------------------------------------------------
output "cognito_user_pool_domain" {
  value = "https://${aws_cognito_user_pool_domain.this.domain}.auth.${local.region}.amazoncognito.com"
}
