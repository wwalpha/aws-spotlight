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
# Suffix
# ----------------------------------------------------------------------------------------------
output "suffix" {
  value = local.suffix
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
# S3 Bucket Name (Archive)
# ----------------------------------------------------------------------------------------------
output "bucket_name_archive" {
  value = aws_s3_bucket.archive.id
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Name - EventType
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_event_type" {
  value = aws_dynamodb_table.event_type.name
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Name - Events
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_events" {
  value = aws_dynamodb_table.events.name
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Name - Resource
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_resources" {
  value = aws_dynamodb_table.resource.name
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Name - Raw
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_raw" {
  value = aws_dynamodb_table.raw.name
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
# DynamoDB Name - User
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_users" {
  value = aws_dynamodb_table.user.name
}

# ----------------------------------------------------------------------------------------------
# DynamoDB Name - Settings
# ----------------------------------------------------------------------------------------------
output "dynamodb_name_settings" {
  value = aws_dynamodb_table.settings.name
}

# ----------------------------------------------------------------------------------------------
# Domain dns servers
# ----------------------------------------------------------------------------------------------
output "dns_servers" {
  sensitive = true
  value     = aws_route53_zone.arms.name_servers
}

# ----------------------------------------------------------------------------------------------
# Domain dns servers
# ----------------------------------------------------------------------------------------------
output "route53_zone_name" {
  sensitive = true
  value     = aws_route53_zone.arms.name
}
