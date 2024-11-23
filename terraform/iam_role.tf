# ----------------------------------------------------------------------------------------------
# AWS IAM Role - Athena Daily Query
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "daily_query" {
  name               = "${upper(local.project_name)}-AthenaDailyQueryRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role - DynamoDB Daily Import
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "daily_import" {
  name               = "${upper(local.project_name)}-DynamoDBDailyImportRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}
