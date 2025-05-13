# ----------------------------------------------------------------------------------------------
# AWS Lambda Function - Athena Daily Batch
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "daily_batch" {
  function_name    = "${local.project_name}-dailybatch-${local.environment}"
  handler          = "index.handler"
  memory_size      = 128
  role             = aws_iam_role.daily_batch.arn
  runtime          = "nodejs22.x"
  filename         = data.archive_file.default.output_path
  source_code_hash = data.archive_file.default.output_base64sha256
  timeout          = 900

  environment {
    variables = {
      BUCKET_NAME       = aws_s3_bucket.material.bucket
      ATHENA_WORKGROUP  = aws_athena_workgroup.this.name
      ATHENA_TABLE_NAME = "${var.athena_table_name}_${local.environment}"
    }
  }

  lifecycle {
    ignore_changes = [
      source_code_hash
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Permission - Athena Daily Batch
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
  image_uri     = data.aws_ecr_image.this.image_uri
  role          = aws_iam_role.cloudtrail_process.arn
  memory_size   = 512
  timeout       = 300

  environment {
    variables = {
      TABLE_NAME_EVENT_TYPE  = aws_dynamodb_table.event_type.name
      TABLE_NAME_RESOURCES   = aws_dynamodb_table.resource.name
      TABLE_NAME_SETTINGS    = aws_dynamodb_table.settings.name
      TABLE_NAME_UNPROCESSED = aws_dynamodb_table.unprocessed.name
      SNS_TOPIC_ARN          = aws_sns_topic.admin.arn
      S3_BUCKET_MATERIALS    = aws_s3_bucket.material.bucket
    }
  }

  lifecycle {
    ignore_changes = [
      image_uri
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Permission - CloudTrail Process
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "cloudtrail_process" {
  statement_id  = "AllowExecutionFromS3"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cloudtrail_process.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.material.arn
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Function - Report
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "report" {
  function_name = "${local.project_name}-report-${local.environment}"
  package_type  = "Image"
  image_uri     = data.aws_ecr_image.this.image_uri
  role          = aws_iam_role.cloudtrail_process.arn
  memory_size   = 256
  timeout       = 30

  environment {
    variables = {
      TABLE_NAME_RESOURCES = aws_dynamodb_table.resource.name
      TABLE_NAME_SETTINGS  = aws_dynamodb_table.settings.name
      TABLE_NAME_EXTEND    = aws_dynamodb_table.extend.name
      S3_BUCKET_MATERIALS  = aws_s3_bucket.material.bucket
    }
  }

  image_config {
    command = ["index.userReport"]
  }

  lifecycle {
    ignore_changes = [
      image_uri
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# API Gateway REST API Integratoin - Report (POST)
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "report" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.report.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.this.execution_arn}/*/POST/report"
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Function - Monthly Cleanup
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "monthly_cleanup" {
  function_name = "${local.project_name}-monthly-cleanup-${local.environment}"
  package_type  = "Image"
  image_uri     = data.aws_ecr_image.this.image_uri
  role          = aws_iam_role.monthly_cleanup.arn
  timeout       = 900

  environment {
    variables = {
      TABLE_NAME_RESOURCES = aws_dynamodb_table.resource.name
      TABLE_NAME_SETTINGS  = aws_dynamodb_table.settings.name
      TABLE_NAME_EXTEND    = aws_dynamodb_table.extend.name
      S3_BUCKET_MATERIALS  = aws_s3_bucket.material.bucket
    }
  }

  image_config {
    command = ["index.monthlyCleanup"]
  }

  lifecycle {
    ignore_changes = [
      image_uri
    ]
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
