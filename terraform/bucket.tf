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
# S3 Object - Athena Daily Query
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "daily_query" {
  bucket = aws_s3_bucket.material.bucket
  key    = "modules/daily_query.zip"
  source = data.archive_file.default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - DynamoDB Daily Import
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "daily_import" {
  bucket = aws_s3_bucket.material.bucket
  key    = "modules/daily_import.zip"
  source = data.archive_file.default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

