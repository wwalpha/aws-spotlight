# ----------------------------------------------------------------------------------------------
# AWS SQS - CloudTrail
# ----------------------------------------------------------------------------------------------
resource "aws_sqs_queue" "cloudtrail" {
  name_prefix                       = "${local.project_name}-cloudtrail-"
  delay_seconds                     = 90
  visibility_timeout_seconds        = 300
  kms_data_key_reuse_period_seconds = 300
  max_message_size                  = 262144
  message_retention_seconds         = 604800
  receive_wait_time_seconds         = 5
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.deadletter.arn
    maxReceiveCount     = 10
  })
}

# ----------------------------------------------------------------------------------------------
# AWS SQS Queue Policy - CloudTrail
# ----------------------------------------------------------------------------------------------
resource "aws_sqs_queue_policy" "cloudtrail" {
  queue_url = aws_sqs_queue.cloudtrail.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "sns.amazonaws.com"
        },
        Action   = "sqs:SendMessage",
        Resource = "${aws_sqs_queue.cloudtrail.arn}",
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = "${aws_sns_topic.cloudtrail.arn}"
          }
        }
      }
    ]
  })
}

# ----------------------------------------------------------------------------------------------
# AWS SQS - DeadLetter
# ----------------------------------------------------------------------------------------------
resource "aws_sqs_queue" "deadletter" {
  name_prefix                       = "${local.project_name}-deadletter-"
  delay_seconds                     = 90
  max_message_size                  = 2048
  message_retention_seconds         = 604800
  kms_data_key_reuse_period_seconds = 300
  receive_wait_time_seconds         = 10
}

