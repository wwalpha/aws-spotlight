# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - CloudTrail
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "cloudtrail" {
  name               = "${local.project_name_uc}_Lambda_CloudTrailRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Execution Policy - S3 ReadOnly Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "cloudtrail_s3_readonly" {
  role       = aws_iam_role.cloudtrail.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - CloudTrail Lambda Basic Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "cloudtrail_basic" {
  role       = aws_iam_role.cloudtrail.name
  policy_arn = local.lambda_basic_policy_arn
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - CloudTrail Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "cloudtrail" {
  name = "ECS_Policy"
  role = aws_iam_role.cloudtrail.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:DescribeTable",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:UpdateItem",
          "sqs:DeleteMessage",
          "sqs:ReceiveMessage",
          "sqs:GetQueueAttributes",
          "sns:Publish"
        ]
        Resource = "*"
      },
    ]
  })
}


# ----------------------------------------------------------------------------------------------
# AWS Role - AWS Batch JOB
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "batch_job" {
  name               = "${local.project_name_uc}_BatchJOBRole"
  assume_role_policy = data.aws_iam_policy_document.batch.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - CloudWatch Full Access
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "batch_job_cloudwatch" {
  role       = aws_iam_role.batch_job.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchFullAccess"
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Execution Role
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "batch_exec" {
  name               = "${local.project_name_uc}_BatchExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks.json
  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Execution Policy - ECS Task Execution Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "batch_exec_default" {
  role       = aws_iam_role.batch_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Execution Policy - CloudWatch Full Access
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "batch_exec_cloudwatch" {
  role       = aws_iam_role.batch_exec.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchFullAccess"
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy - SSM Parameter Store Access
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "batch_exec_ssm" {
  role       = aws_iam_role.batch_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}


# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Unprocessed
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "unprocessed" {
  name               = "${local.project_name_uc}_Lambda_UnprocessedRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  lifecycle {
    create_before_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Unprocessed Lambda Basic Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "unprocessed_basic" {
  role       = aws_iam_role.unprocessed.name
  policy_arn = local.lambda_basic_policy_arn
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Unprocessed Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "unprocessed" {
  name = "ECS_Policy"
  role = aws_iam_role.unprocessed.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:DescribeTable",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:UpdateItem",
          "sns:Publish"
        ]
        Resource = "*"
      },
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role - Authorizer
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role" "authorizer" {
  name               = "${local.project_name_uc}_Lambda_AuthorizerRole"
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Role Policy - Authorizer Basic Policy
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy_attachment" "authorizer" {
  role       = aws_iam_role.authorizer.name
  policy_arn = local.lambda_basic_policy_arn
}
