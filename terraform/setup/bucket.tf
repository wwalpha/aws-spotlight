# ----------------------------------------------------------------------------------------------
# Amazon S3 (WEB SITE)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "frontend" {
  bucket = local.bucket_name_frontend
  acl    = "private"
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 (Environment)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "environment" {
  bucket = local.bucket_name_environment
  acl    = "private"
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 (Archive)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "archive" {
  bucket = local.bucket_name_archive
  acl    = "private"

  lifecycle_rule {
    id                                     = "weekly"
    enabled                                = true
    abort_incomplete_multipart_upload_days = 0

    expiration {
      days                         = 7
      expired_object_delete_marker = false
    }
  }
}

# ----------------------------------------------------------------------------------------------
# DEMO SITE
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "this" {
  for_each     = fileset("website/", "**/*.*")
  bucket       = aws_s3_bucket.frontend.id
  key          = each.value
  source       = "website/${each.value}"
  etag         = filemd5("website/${each.value}")
  content_type = lookup(local.mime_types, split(".", each.value)[length(split(".", each.value)) - 1])

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}
