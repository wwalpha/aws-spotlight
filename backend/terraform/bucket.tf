# ----------------------------------------------------------------------------------------------
# Resource Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "resource" {
  bucket  = local.bucket_name_environment
  key     = "resource.env"
  content = <<EOT
TABLE_NAME_RESOURCES=${local.dynamodb_name_resources}
TABLE_NAME_SETTINGS=${local.dynamodb_name_settings}
TABLE_NAME_ERRORS=${local.dynamodb_name_errors}
TABLE_NAME_UNPROCESSED=${local.dynamodb_name_unprocessed}
TABLE_NAME_IGNORES=${local.dynamodb_name_ignores}
TABLE_NAME_EVENT_TYPE=${local.dynamodb_name_event_type}
SNS_TOPIC_ARN_ADMIN=${data.aws_sns_topic.admin.arn}
S3_BUCKET_ARCHIVE=${local.bucket_name_archive}
EOT
}

# ----------------------------------------------------------------------------------------------
# Auth Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "auth" {
  bucket  = local.bucket_name_environment
  key     = "auth.env"
  content = <<EOT
TABLE_NAME_RESOURCES=${local.dynamodb_name_resources}
TABLE_NAME_SETTINGS=${local.dynamodb_name_settings}
ENDPOINT_USER_SERVICE=http://${local.cloudmap_service_user}.${local.cloudmap_namespace}:8080
EOT
}

# ----------------------------------------------------------------------------------------------
# Token Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "token" {
  bucket  = local.bucket_name_environment
  key     = "token.env"
  content = <<EOT
TABLE_NAME_RESOURCES=${local.dynamodb_name_resources}
ENDPOINT_USER_SERVICE=http://${local.cloudmap_service_user}.${local.cloudmap_namespace}:8080
EOT
}

# ----------------------------------------------------------------------------------------------
# User Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "user" {
  bucket  = local.bucket_name_environment
  key     = "user.env"
  content = <<EOT
TABLE_NAME_SETTINGS=${local.dynamodb_name_settings}
TABLE_NAME_USER=${local.dynamodb_name_users}
EOT
}
