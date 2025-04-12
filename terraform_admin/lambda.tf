# ----------------------------------------------------------------------------------------------
# AWS Lambda Function - Monthly Cleanup
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_function" "monthly_cleanup" {
  function_name = "${local.project_name}-monthly-cleanup"
  handler       = "index.handler"
  memory_size   = 128
  role          = aws_iam_role.monthly_cleanup.arn
  runtime       = "nodejs22.x"
  filename      = data.archive_file.default.output_path
  timeout       = 900

  lifecycle {
    ignore_changes = [
      source_code_hash
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
