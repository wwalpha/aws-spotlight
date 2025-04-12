# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule - Athena Daily Batch
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "athena_daily_batch" {
  name                = "${local.project_name}-daily-batch-${local.environment}"
  schedule_expression = "cron(0 1 * * ? *)"
  state               = "ENABLED"
  # state               = local.isDev ? "DISABLED" : "ENABLED"
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Target - Athena Daily Batch
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "athena_daily_batch" {
  rule = aws_cloudwatch_event_rule.athena_daily_batch.name
  arn  = aws_lambda_function.daily_batch.arn
}
