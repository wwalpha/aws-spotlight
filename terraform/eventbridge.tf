# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule - Athena Daily Batch
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "athena_daily_batch" {
  name                = "${local.project_name}-daily-batch-${local.environment}"
  schedule_expression = "cron(0 1 * * ? *)"
  state               = "ENABLED"
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Target - Athena Daily Batch
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "athena_daily_batch" {
  depends_on = [aws_lambda_function.daily_batch, aws_cloudwatch_event_rule.athena_daily_batch]
  rule       = aws_cloudwatch_event_rule.athena_daily_batch.name
  arn        = aws_lambda_function.daily_batch.arn
}
# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule - Monthly Clearnup
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "monthly_cleanup" {
  name                = "${local.project_name}-monthly-cleanup-${local.environment}"
  schedule_expression = "cron(0 0 1 * ? *)"
  state               = "DISABLED"
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Target - Athena Daily Batch
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "monthly_cleanup" {
  rule = aws_cloudwatch_event_rule.monthly_cleanup.name
  arn  = aws_lambda_function.monthly_cleanup.arn
}
