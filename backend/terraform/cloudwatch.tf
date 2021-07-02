# ----------------------------------------------------------------------------------------------
# CloudWatch Event Rule
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_rule" "unprocessed" {
  name                = "${local.project_name_uc}_UnprocessedRule"
  description         = "unprocessed schedule"
  schedule_expression = "cron(0 0/3 * * ? *)"
}

# ----------------------------------------------------------------------------------------------
# CloudWatch Event Rule
# ----------------------------------------------------------------------------------------------
resource "aws_cloudwatch_event_target" "unprocessed" {
  rule = aws_cloudwatch_event_rule.unprocessed.name
  arn  = aws_lambda_function.unprocessed.arn
}

# ----------------------------------------------------------------------------------------------
# Synthetics Canary - Audit Region
# ----------------------------------------------------------------------------------------------
resource "aws_synthetics_canary" "audit_region" {
  name                 = "audit-region"
  artifact_s3_location = "s3://${local.bucket_name_archive}/synthetics"
  execution_role_arn   = aws_iam_role.synthetics.arn
  handler              = "apiCanaryBlueprint.handler"
  zip_file             = "datas/cloudwatch-synthetics.zip"
  runtime_version      = "syn-nodejs-puppeteer-3.1"

  schedule {
    duration_in_seconds = 0
    expression          = "cron(0 16 ? * * *)"
  }
}
