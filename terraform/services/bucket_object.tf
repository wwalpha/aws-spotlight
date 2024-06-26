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
# S3 Object - Lambda filtering raw module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_filtering_raw" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_filtering_raw
  source = data.archive_file.lambda_default.output_path

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda filtering events module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_filtering_events" {
  bucket = local.bucket_name_archive
  key    = local.bucket_key_lambda_filtering_events
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

# ----------------------------------------------------------------------------------------------
# S3 Object - Lambda libraries module
# ----------------------------------------------------------------------------------------------
resource "aws_s3_object" "lambda_libraries" {
  depends_on = [null_resource.libraries]
  bucket     = local.bucket_name_archive
  key        = local.bucket_key_lambda_libraries
  source     = "${path.module}/libraries.zip"

  lifecycle {
    ignore_changes = [
      etag
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Layer libraries
# ----------------------------------------------------------------------------------------------
resource "null_resource" "libraries" {
  triggers = {
    file_content_md5 = md5(file("${path.module}/libraries/package.json"))
  }

  provisioner "local-exec" {
    command = "sh ${path.module}/libraries/scripts.sh"
  }
}
