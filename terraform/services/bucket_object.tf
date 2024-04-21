# ----------------------------------------------------------------------------------------------
# Archive file - Lambda default module
# ----------------------------------------------------------------------------------------------
data "archive_file" "lambda_default" {
  type        = "zip"
  output_path = "${path.module}/dist/default.zip"

  source {
    content  = <<EOT
exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
EOT
    filename = "index.js"
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda filtering module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_filtering" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_filtering
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda streaming module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_streaming" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_streaming
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}
