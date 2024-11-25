# ----------------------------------------------------------------------------------------------
# Amazon S3 Bucket - Material
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket" "material" {
  bucket = local.bucket_name_material
}

# ----------------------------------------------------------------------------------------------
# AWS S3 Bucket Versioning - Enabled
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_versioning" "material" {
  bucket = aws_s3_bucket.material.id
  versioning_configuration {
    status = "Enabled"
  }
}

# ----------------------------------------------------------------------------------------------
# Archive file - Athena Daily Query
# ----------------------------------------------------------------------------------------------
data "archive_file" "default" {
  type        = "zip"
  output_path = "${path.module}/dist/default.zip"

  source {
    content  = local.lambda_default_content
    filename = "index.js"
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Athena Daily Batch
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "daily_batch" {
  bucket = aws_s3_bucket.material.bucket
  key    = "modules/daily_batch.zip"
  source = data.archive_file.default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}
