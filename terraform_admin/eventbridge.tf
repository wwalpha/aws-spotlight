# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Rule - Monthly Clearnup
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "monthly_cleanup" {
  name                = "${local.project_name}-monthly-cleanup"
  schedule_expression = "cron(0 0 1 * ? *)"
  state               = "ENABLED"
}

# ----------------------------------------------------------------------------------------------
# AWS CloudWatch Event Target - Athena Daily Batch
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "monthly_cleanup" {
  rule = aws_cloudwatch_event_rule.monthly_cleanup.name
  arn  = aws_lambda_function.monthly_cleanup.arn
}
