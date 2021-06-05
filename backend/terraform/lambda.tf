# ----------------------------------------------------------------------------------------------
# Lambda Function - CloudTrail
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "cloudtrail" {
  function_name = "${local.project_name}-cloudtrail"
  package_type  = "Image"
  image_uri     = data.aws_ssm_parameter.cloudtrail_repo_url.value
  memory_size   = 256
  role          = aws_iam_role.cloudtrail.arn
  timeout       = 300
  environment {
    variables = {
      TABLE_NAME_EVENT_TYPE  = local.dynamodb_name_event_type
      TABLE_NAME_RESOURCE    = local.dynamodb_name_resource
      TABLE_NAME_UNPROCESSED = local.dynamodb_name_unprocessed
      TABLE_NAME_HISTORY     = local.dynamodb_name_history
      SQS_URL                = data.aws_sqs_queue.cloudtrail.url
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - CloudTrail
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function_event_invoke_config" "cloudtrail" {
  function_name = aws_lambda_function.cloudtrail.function_name

  destination_config {
    on_failure {
      destination = data.aws_sns_topic.admin.arn
    }
  }
}

# ---------------------------------------------------------------------------------------------
# Lambda Event Source Mapping
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_event_source_mapping" "cloudtrail" {
  event_source_arn                   = data.aws_sqs_queue.cloudtrail.arn
  function_name                      = aws_lambda_function.cloudtrail.arn
  batch_size                         = 100
  maximum_batching_window_in_seconds = 300
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Unprocessed
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "unprocessed" {
  function_name = "${local.project_name}-unprocessed"
  package_type  = "Image"
  image_uri     = data.aws_ssm_parameter.unprocessed_repo_url.value
  memory_size   = 256
  role          = aws_iam_role.unprocessed.arn
  timeout       = 300
  environment {
    variables = {
      TABLE_NAME_EVENT_TYPE  = local.dynamodb_name_event_type
      TABLE_NAME_RESOURCE    = local.dynamodb_name_resource
      TABLE_NAME_UNPROCESSED = local.dynamodb_name_unprocessed
      TABLE_NAME_HISTORY     = local.dynamodb_name_history
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Permission - Unprocessed
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "unprocessed" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.unprocessed.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.unprocessed.arn
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Unprocessed
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function_event_invoke_config" "unprocessed" {
  function_name = aws_lambda_function.unprocessed.function_name

  destination_config {
    on_failure {
      destination = data.aws_sns_topic.admin.arn
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - CloudTrail
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "authorizer" {
  function_name = "${local.project_name}-authorizer"
  filename      = data.archive_file.authorizer.output_path
  handler       = local.lambda_handler
  runtime       = local.lambda_runtime
  memory_size   = 128
  role          = aws_iam_role.cloudtrail.arn
  timeout       = 3
}

data "archive_file" "authorizer" {
  type        = "zip"
  output_path = "${path.module}/authorizer.zip"

  source {
    content  = <<EOT
exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
EOT
    filename = "index.js"
  }
}
