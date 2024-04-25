# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - CloudTrail repository url
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "cloudtrail_repo_url" {
  name  = "/${local.project_name}/repository_url/cloudtrail"
  type  = "String"
  value = "${data.aws_ecr_repository.cloudtrail.repository_url}:latest"

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Unprocessed repository url
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "unprocessed_repo_url" {
  name  = "/${local.project_name}/repository_url/unprocessed"
  type  = "String"
  value = "${data.aws_ecr_repository.unprocessed.repository_url}:latest"

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}
