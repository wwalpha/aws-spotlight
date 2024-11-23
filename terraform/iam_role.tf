# ----------------------------------------------------------------------------------------------
# AWS IAM Role - Athena Daily Query
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "daily_query" {
  name               = "${upper(local.project_name)}-AthenaDailyQueryRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role - CloudTrail Process
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "cloudtrail_process" {
  name               = "${upper(local.project_name)}-LambdaCloudTrailProcessRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}
