# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - Daily Batch (Lambda Baisc)
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "daily_batch_lambda_basic" {
  role       = aws_iam_role.daily_batch.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - Daily Batch Athena FullAccess
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "daily_batch_athena" {
  role       = aws_iam_role.daily_batch.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonAthenaFullAccess"
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - Athena Daily Query (Lambda Baisc)
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "daily_batch_athena_execution" {
  name = "AthenaExecutionPolicy"
  role = aws_iam_role.daily_batch.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "athena:StartQueryExecution",
          "athena:GetQueryExecution",
          "athena:GetQueryResults",
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ]
        Resource = [
          "${aws_s3_bucket.material.arn}",
          "${aws_s3_bucket.material.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket",
        ]
        Resource = [
          "arn:aws:s3:::${var.cloudtrail_bucket_name}",
          "arn:aws:s3:::${var.cloudtrail_bucket_name}/*"
        ]
      },
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - CloudTrail Process DynamoDB FullAccess
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "cloudtrail_process_dynamodb" {
  role       = aws_iam_role.cloudtrail_process.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - CloudTrail Process ECR FullAccess
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "cloudtrail_process_ecr" {
  role       = aws_iam_role.cloudtrail_process.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPullOnly"
}

