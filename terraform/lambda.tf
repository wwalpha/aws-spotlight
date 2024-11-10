# ----------------------------------------------------------------------------------------------
# AWS Lambda Function - Athena Daily Query
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "daily_query" {
  function_name     = "${local.project_name}-daily-query-${local.environment}"
  handler           = "index.handler"
  memory_size       = 128
  role              = aws_iam_role.daily_query.arn
  runtime           = "nodejs20.x"
  s3_bucket         = aws_s3_object.daily_query.bucket
  s3_key            = aws_s3_object.daily_query.key
  s3_object_version = aws_s3_object.daily_query.version_id
  timeout           = 900
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Permission - Athena Daily Query
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "daily_query" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.daily_query.arn
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.athena_daily_query.arn
}
