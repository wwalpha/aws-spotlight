# ----------------------------------------------------------------------------------------------
# AWS SNS Topic Subscription - ADMIN
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic" "admin" {
  name = "${local.project_name}-admin-${local.environment}"
}

# ----------------------------------------------------------------------------------------------
# AWS SNS Topic Subscription - ADMIN
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic_subscription" "admin" {
  topic_arn = aws_sns_topic.admin.arn
  protocol  = "email"
  endpoint  = var.admin_email
}
