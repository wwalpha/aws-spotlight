# ----------------------------------------------------------------------------------------------
# Resource Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "resource" {
  bucket  = local.bucket_name_environment
  key     = "resource.env"
  content = ""

  lifecycle {
    ignore_changes = [
      content
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# Auth Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "auth" {
  bucket  = local.bucket_name_environment
  key     = "auth.env"
  content = ""

  lifecycle {
    ignore_changes = [
      content
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# Token Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "token" {
  bucket  = local.bucket_name_environment
  key     = "token.env"
  content = ""

  lifecycle {
    ignore_changes = [
      content
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# User Manager Environment file
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "user" {
  bucket  = local.bucket_name_environment
  key     = "user.env"
  content = ""

  lifecycle {
    ignore_changes = [
      content
    ]
  }
}
