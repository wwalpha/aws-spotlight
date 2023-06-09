# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "ecs_tasks" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Role Policy
# ----------------------------------------------------------------------------------------------
data "aws_iam_policy_document" "batch" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["batch.amazonaws.com"]
    }
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Task Execution Role
# ----------------------------------------------------------------------------------------------
resource "aws_iam_role_policy" "ecs_task_exec" {
  name = "s3_policy"
  role = aws_iam_role.ecs_task_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
        ]
        Effect   = "Allow"
        Resource = "${data.aws_s3_bucket.environment.arn}/*"
      },
      {
        Action = [
          "s3:GetBucketLocation",
        ]
        Effect   = "Allow"
        Resource = "${data.aws_s3_bucket.environment.arn}"
      }
    ]
  })
}
