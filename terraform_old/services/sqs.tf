# ----------------------------------------------------------------------------------------------
# AWS SQS - CloudTrail
# ----------------------------------------------------------------------------------------------
resource "aws_sqs_queue" "cloudtrail" {
  name                              = "${local.project_name}-cloudtrail-${local.suffix}"
  delay_seconds                     = 90
  visibility_timeout_seconds        = 300
  kms_data_key_reuse_period_seconds = 300
  max_message_size                  = 262144
  message_retention_seconds         = 604800
  receive_wait_time_seconds         = 5
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.deadletter.arn
    maxReceiveCount     = 5
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
  name                              = "${local.project_name}-deadletter-${local.suffix}"
  delay_seconds                     = 90
  visibility_timeout_seconds        = 300
  kms_data_key_reuse_period_seconds = 300
  max_message_size                  = 262144
  message_retention_seconds         = 604800
  receive_wait_time_seconds         = 5
}

# ----------------------------------------------------------------------------------------------
# AWS SQS - Filtering RAW
# ----------------------------------------------------------------------------------------------
resource "aws_sqs_queue" "filtering_raw" {
  name                              = "${local.project_name}-filtering-raw-${local.suffix}"
  delay_seconds                     = 90
  visibility_timeout_seconds        = 300
  kms_data_key_reuse_period_seconds = 300
  max_message_size                  = 262144
  message_retention_seconds         = 604800
  receive_wait_time_seconds         = 5
}

# ----------------------------------------------------------------------------------------------
# AWS SQS Queue Policy - Filtering RAW
# ----------------------------------------------------------------------------------------------
resource "aws_sqs_queue_policy" "filtering_raw" {
  queue_url = aws_sqs_queue.filtering_raw.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "sns.amazonaws.com"
        },
        Action   = "sqs:SendMessage",
        Resource = "${aws_sqs_queue.filtering_raw.arn}",
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = "${aws_sns_topic.filtering_raw.arn}"
          }
        }
      }
    ]
  })
}


# ----------------------------------------------------------------------------------------------
# AWS SQS - Filtering Events
# ----------------------------------------------------------------------------------------------
resource "aws_sqs_queue" "filtering_events" {
  name                              = "${local.project_name}-filtering-events-${local.suffix}"
  delay_seconds                     = 90
  visibility_timeout_seconds        = 300
  kms_data_key_reuse_period_seconds = 300
  max_message_size                  = 262144
  message_retention_seconds         = 604800
  receive_wait_time_seconds         = 5
}

# ----------------------------------------------------------------------------------------------
# AWS SQS Queue Policy - Filtering Events
# ----------------------------------------------------------------------------------------------
resource "aws_sqs_queue_policy" "filtering_events" {
  queue_url = aws_sqs_queue.filtering_events.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "sns.amazonaws.com"
        },
        Action   = "sqs:SendMessage",
        Resource = "${aws_sqs_queue.filtering_events.arn}",
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = "${aws_sns_topic.filtering_events.arn}"
          }
        }
      }
    ]
  })
}
