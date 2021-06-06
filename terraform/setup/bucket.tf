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
# DEMO SITE
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_object" "this" {
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
