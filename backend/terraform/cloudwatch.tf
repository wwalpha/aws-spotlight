# ----------------------------------------------------------------------------------------------
# CloudWatch Event Rule
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "unprocessed" {
  name                = "${local.project_name_uc}_UnprocessedRule"
  description         = "unprocessed schedule"
  schedule_expression = "cron(0 0/12 * * ? *)"
}

# ----------------------------------------------------------------------------------------------
# CloudWatch Event Rule
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "unprocessed" {
  rule = aws_cloudwatch_event_rule.unprocessed.name
  arn  = aws_lambda_function.unprocessed.arn
}
