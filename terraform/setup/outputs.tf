# ----------------------------------------------------------------------------------------------
# Project Name
# ----------------------------------------------------------------------------------------------
output "project_name" {
  value = var.project_name
}

# ----------------------------------------------------------------------------------------------
# Project Name UC
# ----------------------------------------------------------------------------------------------
output "project_name_uc" {
  value = local.project_name_uc
}

# ----------------------------------------------------------------------------------------------
# S3 Bucket Name (Frontend)
# ----------------------------------------------------------------------------------------------
output "bucket_name_frontend" {
  value = aws_s3_bucket.frontend.id
}

# ----------------------------------------------------------------------------------------------
# S3 Bucket Name (Environment)
# ----------------------------------------------------------------------------------------------
output "bucket_name_environment" {
  value = aws_s3_bucket.environment.id
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Name - EventType
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_event_type" {
  value = aws_dynamodb_table.event_type.name
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Name - Notification
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_notification" {
  value = aws_dynamodb_table.notification.name
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Name - Resource
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_resource" {
  value = aws_dynamodb_table.resource.name
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Name - Unprocessed
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_unprocessed" {
  value = aws_dynamodb_table.unprocessed.name
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Name - History
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_history" {
  value = aws_dynamodb_table.history.name
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Name - Announcement
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_announcement" {
  value = aws_dynamodb_table.announcement.name
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Name - Category
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_category" {
  value = aws_dynamodb_table.category.name
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Name - User
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_user" {
  value = aws_dynamodb_table.user.name
}
