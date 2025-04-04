# ----------------------------------------------------------------------------------------------
# AWS Lambda Function - Athena Daily Batch
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "daily_batch" {
  function_name     = "${local.project_name}-daily-${local.environment}"
  handler           = "index.handler"
  memory_size       = 128
  role              = aws_iam_role.daily_batch.arn
  runtime           = "nodejs20.x"
  s3_bucket         = aws_s3_object.daily_batch.bucket
  s3_key            = aws_s3_object.daily_batch.key
  s3_object_version = aws_s3_object.daily_batch.version_id
  timeout           = 900

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.material.bucket
    }
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Permission - Athena Daily Query
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "daily_batch" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.daily_batch.arn
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.athena_daily_batch.arn
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Function - CloudTrail Process
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "cloudtrail_process" {
  function_name = "${local.project_name}-cloudtrail-process-${local.environment}"
  package_type  = "Image"
  image_uri     = data.aws_ecr_image.latest.image_uri
  role          = aws_iam_role.cloudtrail_process.arn
  memory_size   = 512
  timeout       = 300

  environment {
    variables = {
      TABLE_NAME_EVENT_TYPE = aws_dynamodb_table.event_type.name
      TABLE_NAME_RESOURCES  = aws_dynamodb_table.resource.name
      TABLE_NAME_SETTINGS   = aws_dynamodb_table.settings.name
      SNS_TOPIC_ARN         = aws_sns_topic.admin.arn
      S3_BUCKET_MATERIALS   = aws_s3_bucket.material.bucket
    }
  }
}
