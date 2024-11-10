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
# AWS SNS Topic Subscription - Filtering Raw
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic" "filtering_raw" {
  name = "${local.project_name}-filtering-raw-${local.suffix}"
}

# ----------------------------------------------------------------------------------------------
# AWS SNS Topic Subscription - Filtering Raw
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic_subscription" "filtering_raw" {
  topic_arn = aws_sns_topic.filtering_raw.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.filtering_raw.arn
}

# ----------------------------------------------------------------------------------------------
# AWS SNS Topic Subscription - Filtering Events
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic" "filtering_events" {
  name = "${local.project_name}-filtering-events-${local.suffix}"
}

# ----------------------------------------------------------------------------------------------
# AWS SNS Topic Subscription - Filtering Events
# ----------------------------------------------------------------------------------------------
resource "aws_sns_topic_subscription" "filtering_events" {
  topic_arn = aws_sns_topic.filtering_events.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.filtering_events.arn
}
