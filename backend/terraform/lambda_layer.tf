# ----------------------------------------------------------------------------------------------
# AWS Lambda Layer Version
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_layer_version" "libraries" {
  layer_name          = "${local.project_name}-libraries-${local.suffix}"
  s3_bucket           = data.aws_s3_object.lambda_filtering_raw.bucket
  s3_key              = data.aws_s3_object.lambda_filtering_raw.key
  s3_object_version   = data.aws_s3_object.lambda_filtering_raw.version_id
  compatible_runtimes = ["nodejs20.x"]
}
