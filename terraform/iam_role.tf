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

# ----------------------------------------------------------------------------------------------
# AWS IAM Role - Monthly Cleanup
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "monthly_cleanup" {
  name               = "${local.project_name}-monthly-cleanup-${local.environment}"
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - Monthly Cleanup (AmazonEC2FullAccess)
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "monthly_cleanup_ec2" {
  role       = aws_iam_role.monthly_cleanup.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2FullAccess"
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - Monthly Cleanup (IAM FullAccess)
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "monthly_cleanup_iam" {
  role       = aws_iam_role.monthly_cleanup.name
  policy_arn = "arn:aws:iam::aws:policy/IAMFullAccess"
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - Monthly Cleanup (AWSLambdaBasicExecutionRole)
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "monthly_cleanup_basic" {
  role       = aws_iam_role.monthly_cleanup.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

