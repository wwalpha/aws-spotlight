# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - Athena Daily Query (Lambda Baisc)
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "daily_batch_lambda_basic" {
  role       = aws_iam_role.daily_batch.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
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
        ]
        Resource = [
          aws_s3_bucket.material.arn,
          "${aws_s3_bucket.material.arn}/*"
        ]
      },
    ]
  })
}
