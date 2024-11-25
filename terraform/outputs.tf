output "ecr_repository_url" {
  value = aws_ecr_repository.cloudtrail.repository_url
}

output "lambda_function_name_cloudtrail_process" {
  value = aws_lambda_function.cloudtrail_process.function_name
}

output "lambda_function_name_daily_batch" {
  value = aws_lambda_function.daily_batch.function_name
}
