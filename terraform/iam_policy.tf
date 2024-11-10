# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - Athena Daily Query (Lambda Baisc)
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "daily_query_lambda_basic" {
  role       = aws_iam_role.daily_query.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# ----------------------------------------------------------------------------------------------
# AWS IAM Role Policy - Athena Daily Query (Lambda Baisc)
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "daily_query_athena_execution" {
  name = "AthenaDailyQueryLambdaAthenaExecutionPolicy"
  role = aws_iam_role.daily_query.name
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
    ]
  })
}
