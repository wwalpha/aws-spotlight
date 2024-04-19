# ----------------------------------------------------------------------------------------------
# AWS SNS Topic Subscription - ADMIN
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic" "admin" {
  name = "${local.project_name}-admin-${local.suffix}"
}

# ----------------------------------------------------------------------------------------------
# AWS SNS Topic Subscription - ADMIN
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic_subscription" "admin" {
  topic_arn = aws_sns_topic.admin.arn
  protocol  = "email"
  endpoint  = var.admin_email
}

# ----------------------------------------------------------------------------------------------
# AWS SNS Topic Subscription - CloudTrail
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic" "cloudtrail" {
  name = "${local.project_name}-cloudtrail-${local.suffix}"
}

# ----------------------------------------------------------------------------------------------
# AWS SNS Topic Subscription - CloudTrail
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic_subscription" "cloudtrail" {
  topic_arn = aws_sns_topic.cloudtrail.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.cloudtrail.arn
}

# ----------------------------------------------------------------------------------------------
# AWS SNS Topic Subscription - Filtering
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic" "filtering" {
  name = "${local.project_name}-filtering-${local.suffix}"
}

# ----------------------------------------------------------------------------------------------
# AWS SNS Topic Subscription - Filtering
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic_subscription" "filtering" {
  topic_arn = aws_sns_topic.filtering.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.filtering.arn
}
