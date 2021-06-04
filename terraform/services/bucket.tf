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
ENDPOINT_USER=http://${aws_service_discovery_service.token.name}.${aws_service_discovery_private_dns_namespace.this.name}
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
