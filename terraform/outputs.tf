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
