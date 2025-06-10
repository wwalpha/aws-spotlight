# ----------------------------------------------------------------------------------------------
# AWS Lambda Layer Version
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_layer_version" "libraries" {
  layer_name          = "${local.project_name}-libraries-${local.suffix}"
  s3_bucket           = data.aws_s3_object.lambda_libraries.bucket
  s3_key              = data.aws_s3_object.lambda_libraries.key
  s3_object_version   = data.aws_s3_object.lambda_libraries.version_id
  compatible_runtimes = ["nodejs22.x"]
}
