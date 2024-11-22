# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule - Athena Daily Query
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "athena_daily_query" {
  name                = "${local.project_name}-daily-query-${local.environment}"
  schedule_expression = "cron(0 1 * * ? *)"
  state               = local.isDev ? "DISABLED" : "ENABLED"
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Target - Athena Daily Query
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "athena_daily_query" {
  rule = aws_cloudwatch_event_rule.athena_daily_query.name
  arn  = aws_lambda_function.daily_query.arn
}
