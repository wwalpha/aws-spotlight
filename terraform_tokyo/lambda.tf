# ----------------------------------------------------------------------------------------------
# AWS Lambda Function - Monthly Cleanup
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "monthly_cleanup" {
  function_name     = "${local.project_name}-monthly-cleanup"
  handler           = "index.handler"
  memory_size       = 128
  role              = aws_iam_role.monthly_cleanup.arn
  runtime           = "nodejs22.x"
  s3_bucket         = aws_s3_object.daily_batch.bucket
  s3_key            = aws_s3_object.daily_batch.key
  s3_object_version = aws_s3_object.daily_batch.version_id
  timeout           = 900

  environment {
    variables = {
      BUCKET_NAME       = aws_s3_bucket.material.bucket
      ATHENA_WORKGROUP  = aws_athena_workgroup.this.name
      ATHENA_TABLE_NAME = var.athena_table_name
    }
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Permission - Athena Daily Query
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "monthly_cleanup" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.monthly_cleanup.arn
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.monthly_cleanup.arn
}
