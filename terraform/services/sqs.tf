# ----------------------------------------------------------------------------------------------
# AWS SQS - CloudTrail
# ----------------------------------------------------------------------------------------------
resource "aws_sqs_queue" "cloudtrail" {
  name_prefix                = "${local.project_name}-cloudtrail-"
  delay_seconds              = 90
  visibility_timeout_seconds = 300
  max_message_size           = 262144
  message_retention_seconds  = 604800
  receive_wait_time_seconds  = 5
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.deadletter.arn
    maxReceiveCount     = 10
  })
}

# ----------------------------------------------------------------------------------------------
# AWS SQS - DeadLetter
# ----------------------------------------------------------------------------------------------
resource "aws_sqs_queue" "deadletter" {
  name_prefix               = "${local.project_name}-deadletter-"
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 604800
  receive_wait_time_seconds = 10
}

