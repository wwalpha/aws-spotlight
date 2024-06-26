# ----------------------------------------------------------------------------------------------
# Lambda Function - CloudTrail
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "cloudtrail" {
  function_name = "${local.project_name}-cloudtrail-${local.suffix}"
  package_type  = "Image"
  image_uri     = data.aws_ssm_parameter.cloudtrail_repo_url.value
  memory_size   = 1024
  role          = aws_iam_role.cloudtrail.arn
  timeout       = 300

  environment {
    variables = {
      TABLE_NAME_EVENT_TYPE  = local.dynamodb_name_event_type
      TABLE_NAME_EVENTS      = local.dynamodb_name_events
      TABLE_NAME_RESOURCES   = local.dynamodb_name_resources
      TABLE_NAME_UNPROCESSED = local.dynamodb_name_unprocessed
      SNS_TOPIC_ARN          = data.aws_sns_topic.admin.arn
      SQS_URL_CLOUDTRAIL     = data.aws_sqs_queue.cloudtrail.url
    }
  }

  lifecycle {
    ignore_changes = [
      image_uri
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function Event Invok Dead Queue - CloudTrail
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
  batch_size                         = 1
  maximum_batching_window_in_seconds = 10
  enabled                            = true
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Filtering Raw
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "filtering_raw" {
  function_name     = "${local.project_name}-filtering-raw-${local.suffix}"
  s3_bucket         = data.aws_s3_object.lambda_filtering_raw.bucket
  s3_key            = data.aws_s3_object.lambda_filtering_raw.key
  s3_object_version = data.aws_s3_object.lambda_filtering_raw.version_id
  handler           = local.lambda_handler
  memory_size       = 2048
  role              = aws_iam_role.cloudtrail.arn
  runtime           = local.lambda_runtime
  timeout           = 300

  layers = [
    aws_lambda_layer_version.libraries.arn
  ]

  environment {
    variables = {
      TABLE_NAME_RAW   = local.dynamodb_name_raw
      SQS_URL_RAW      = data.aws_sqs_queue.filtering_raw.url
      TOPIC_ARN_EVENTS = data.aws_sns_topic.filtering_events.arn
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Filtering Raw
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function_event_invoke_config" "filtering_raw" {
  function_name = aws_lambda_function.filtering_raw.function_name

  destination_config {
    on_failure {
      destination = data.aws_sns_topic.admin.arn
    }
  }
}

# ---------------------------------------------------------------------------------------------
# Lambda Event Source Mapping - Filtering Raw
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_event_source_mapping" "filtering_raw" {
  event_source_arn                   = data.aws_sqs_queue.filtering_raw.arn
  function_name                      = aws_lambda_function.filtering_raw.arn
  batch_size                         = 10
  maximum_batching_window_in_seconds = 10
  enabled                            = true

  scaling_config {
    maximum_concurrency = 200
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Filtering Events
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "filtering_events" {
  function_name     = "${local.project_name}-filtering-events-${local.suffix}"
  s3_bucket         = data.aws_s3_object.lambda_filtering_events.bucket
  s3_key            = data.aws_s3_object.lambda_filtering_events.key
  s3_object_version = data.aws_s3_object.lambda_filtering_events.version_id
  handler           = local.lambda_handler
  memory_size       = 1024
  role              = aws_iam_role.cloudtrail.arn
  runtime           = local.lambda_runtime
  timeout           = 300

  layers = [
    aws_lambda_layer_version.libraries.arn
  ]

  environment {
    variables = {
      TABLE_NAME_RAW        = local.dynamodb_name_raw
      TABLE_NAME_EVENTS     = local.dynamodb_name_events
      TABLE_NAME_EVENT_TYPE = local.dynamodb_name_event_type
      SQS_URL_EVENTS        = data.aws_sqs_queue.filtering_events.url
      TOPIC_ARN_CLOUDTRAIL  = data.aws_sns_topic.cloudtrail.arn
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Filtering Events
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function_event_invoke_config" "filtering_events" {
  function_name = aws_lambda_function.filtering_events.function_name

  destination_config {
    on_failure {
      destination = data.aws_sns_topic.admin.arn
    }
  }
}

# ---------------------------------------------------------------------------------------------
# Lambda Event Source Mapping - Filtering Events
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_event_source_mapping" "filtering_events" {
  event_source_arn                   = data.aws_sqs_queue.filtering_events.arn
  function_name                      = aws_lambda_function.filtering_events.arn
  batch_size                         = 10
  maximum_batching_window_in_seconds = 10
  enabled                            = true

  scaling_config {
    maximum_concurrency = 200
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Unprocessed
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "unprocessed" {
  function_name = "${local.project_name}-unprocessed-${local.suffix}"
  package_type  = "Image"
  image_uri     = data.aws_ssm_parameter.unprocessed_repo_url.value
  memory_size   = 256
  role          = aws_iam_role.unprocessed.arn
  timeout       = 300
  environment {
    variables = {
      TABLE_NAME_EVENT_TYPE  = local.dynamodb_name_event_type
      TABLE_NAME_RESOURCES   = local.dynamodb_name_resources
      TABLE_NAME_UNPROCESSED = local.dynamodb_name_unprocessed
      TABLE_NAME_HISTORY     = local.dynamodb_name_history
    }
  }

  lifecycle {
    ignore_changes = [
      image_uri
    ]
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
# Lambda Function - Authorizer
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "authorizer" {
  function_name = "${local.project_name}-authorizer-${local.suffix}"
  filename      = data.archive_file.authorizer.output_path
  handler       = local.lambda_handler
  runtime       = local.lambda_runtime
  memory_size   = 128
  role          = aws_iam_role.cloudtrail.arn
  timeout       = 3
  environment {
    variables = {
      TABLE_NAME_USER     = local.dynamodb_name_users
      TABLE_NAME_SETTINGS = local.dynamodb_name_settings
    }
  }
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

# ----------------------------------------------------------------------------------------------
# Lambda Permission - Authorizer
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "authorizer" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.authorizer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${local.apigateway_execution_arn}/authorizers/${aws_apigatewayv2_authorizer.this.id}"
}

# ----------------------------------------------------------------------------------------------
# Lambda Permission - Authorizer
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_permission" "authorizer_api_key" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.authorizer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${local.apigateway_execution_arn}/authorizers/${aws_apigatewayv2_authorizer.api_key.id}"
}

# ----------------------------------------------------------------------------------------------
# Lambda Function Destination - Unprocessed
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function_event_invoke_config" "authorizer" {
  function_name = aws_lambda_function.authorizer.function_name

  destination_config {
    on_failure {
      destination = data.aws_sns_topic.admin.arn
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Lambda Function - Streaming
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "streaming" {
  function_name     = "${local.project_name}-streaming-${local.suffix}"
  s3_bucket         = data.aws_s3_object.lambda_streaming.bucket
  s3_key            = data.aws_s3_object.lambda_streaming.key
  s3_object_version = data.aws_s3_object.lambda_streaming.version_id
  handler           = local.lambda_handler
  memory_size       = 256
  role              = aws_iam_role.streaming.arn
  runtime           = local.lambda_runtime
  timeout           = 30

  layers = [
    aws_lambda_layer_version.libraries.arn
  ]

  environment {
    variables = {
      TABLE_NAME_RESOURCES = local.dynamodb_name_resources
      TABLE_NAME_HISTORIES = local.dynamodb_name_history
    }
  }
}

# ---------------------------------------------------------------------------------------------
# Lambda Event Source Mapping - Streaming
# ---------------------------------------------------------------------------------------------
resource "aws_lambda_event_source_mapping" "streaming" {
  event_source_arn                   = data.aws_dynamodb_table.resources.stream_arn
  function_name                      = aws_lambda_function.streaming.function_name
  starting_position                  = "LATEST"
  batch_size                         = 10
  maximum_batching_window_in_seconds = 10
}
