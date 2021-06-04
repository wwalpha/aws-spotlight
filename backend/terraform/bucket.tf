# ----------------------------------------------------------------------------------------------
# Resource Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_object" "resource" {
  bucket  = local.bucket_name_environment
  key     = "resource.env"
  content = <<EOT
TABLE_RESOURCE=${local.dynamodb_name_resource}
EOT
}

# ----------------------------------------------------------------------------------------------
# Auth Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_object" "auth" {
  bucket  = local.bucket_name_environment
  key     = "auth.env"
  content = <<EOT
TABLE_RESOURCE=${local.dynamodb_name_resource}
ENDPOINT_USER_SERVICE=http://${local.cloudmap_service_auth}.${local.cloudmap_namespace}
EOT
}

# ----------------------------------------------------------------------------------------------
# Token Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_object" "token" {
  bucket  = local.bucket_name_environment
  key     = "token.env"
  content = <<EOT
TABLE_RESOURCE=${local.dynamodb_name_resource}
ENDPOINT_USER_SERVICE=http://${local.cloudmap_service_auth}.${local.cloudmap_namespace}
EOT
}

# ----------------------------------------------------------------------------------------------
# User Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_object" "user" {
  bucket  = local.bucket_name_environment
  key     = "user.env"
  content = <<EOT
TABLE_SETTINGS=${local.dynamodb_name_settings}
TABLE_USER=${local.dynamodb_name_users}
EOT
}
