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
# AWS S3 Bucket Notification - Enabled
# ----------------------------------------------------------------------------------------------
resource "aws_s3_bucket_notification" "cloudtrail" {
  depends_on = [aws_lambda_permission.cloudtrail_process]
  bucket     = aws_s3_bucket.material.id

  lambda_function {
    id                  = "CloudTrailEvent"
    filter_prefix       = "CloudTrail/"
    filter_suffix       = ".csv"
    lambda_function_arn = aws_lambda_function.cloudtrail_process.arn
    events              = ["s3:ObjectCreated:*"]
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
