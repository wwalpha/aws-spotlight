# ----------------------------------------------------------------------------------------------
# Resource Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_object" "resource" {
  bucket  = local.bucket_name_environment
  key     = "resource.env"
  content = <<EOT
TABLE_NAME_RESOURCE=${local.dynamodb_name_resource}
TABLE_NAME_SETTINGS=${local.dynamodb_name_settings}
SNS_TOPIC_ARN_ADMIN=${data.aws_sns_topic.admin.arn}
EOT
}

# ----------------------------------------------------------------------------------------------
# Auth Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_object" "auth" {
  bucket  = local.bucket_name_environment
  key     = "auth.env"
  content = <<EOT
TABLE_NAME_RESOURCE=${local.dynamodb_name_resource}
TABLE_NAME_SETTINGS=${local.dynamodb_name_settings}
ENDPOINT_USER_SERVICE=http://${local.cloudmap_service_user}.${local.cloudmap_namespace}:8080
EOT
}

# ----------------------------------------------------------------------------------------------
# Token Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_object" "token" {
  bucket  = local.bucket_name_environment
  key     = "token.env"
  content = <<EOT
TABLE_NAME_RESOURCE=${local.dynamodb_name_resource}
ENDPOINT_USER_SERVICE=http://${local.cloudmap_service_user}.${local.cloudmap_namespace}:8080
EOT
}

# ----------------------------------------------------------------------------------------------
# User Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_object" "user" {
  bucket  = local.bucket_name_environment
  key     = "user.env"
  content = <<EOT
TABLE_NAME_SETTINGS=${local.dynamodb_name_settings}
TABLE_NAME_USER=${local.dynamodb_name_users}
EOT
}
