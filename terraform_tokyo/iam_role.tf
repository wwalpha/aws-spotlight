# ----------------------------------------------------------------------------------------------
# AWS IAM Role - Monthly Cleanup
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "monthly_cleanup" {
  name               = "${local.project_name}-monthly-cleanup"
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

