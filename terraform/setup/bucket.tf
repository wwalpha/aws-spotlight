# ----------------------------------------------------------------------------------------------
# Amazon S3 (WEB SITE)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "frontend" {
  bucket = local.bucket_name_frontend
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 (Environment)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "environment" {
  bucket = local.bucket_name_environment
}

# ----------------------------------------------------------------------------------------------
# Amazon S3 (Archive)
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "archive" {
  bucket = local.bucket_name_archive
}

resource "aws_s3_bucket_lifecycle_configuration" "archive" {
  bucket = aws_s3_bucket.archive.id

  rule {
    id     = "weekly"
    status = "Enabled"
    abort_incomplete_multipart_upload {
      days_after_initiation = 0
    }
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
