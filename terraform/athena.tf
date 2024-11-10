# ----------------------------------------------------------------------------------------------
# AWS Athena WorkGroup
# ----------------------------------------------------------------------------------------------
resource "aws_athena_workgroup" "this" {
  name = "${local.project_name}-${local.environment}"

  configuration {
    enforce_workgroup_configuration    = false
    publish_cloudwatch_metrics_enabled = false

    result_configuration {
      output_location = "s3://${aws_s3_bucket.material.bucket}/athena/"

      acl_configuration {
        s3_acl_option = "BUCKET_OWNER_FULL_CONTROL"
      }
    }

  }
}
