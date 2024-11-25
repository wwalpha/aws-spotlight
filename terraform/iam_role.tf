# ----------------------------------------------------------------------------------------------
# AWS IAM Role - Athena Daily Batch
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "daily_batch" {
  name               = "${upper(local.project_name)}-${upper(local.environment)}-AthenaDailyBatchRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role - CloudTrail Process
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "cloudtrail_process" {
  name               = "${upper(local.project_name)}-${upper(local.environment)}-LambdaCloudTrailProcessRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}
