# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Auth manager repository url
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "auth_repo_url" {
  name      = "/${local.project_name}/ecs_repository_url/auth_manager"
  type      = "String"
  value     = "${aws_ecr_repository.auth.repository_url}:latest"
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Resource manager repository url
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "resource_repo_url" {
  name      = "/${local.project_name}/ecs_repository_url/resource_manager"
  type      = "String"
  value     = "${aws_ecr_repository.resource.repository_url}:latest"
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}
