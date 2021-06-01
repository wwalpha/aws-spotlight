# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Auth manager repository url
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "auth_repo_url" {
  name      = "/${local.project_name}/repository_url/auth_manager"
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
# SSM Parameter Store - Token manager repository url
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "token_repo_url" {
  name      = "/${local.project_name}/repository_url/token_manager"
  type      = "String"
  value     = "${aws_ecr_repository.token.repository_url}:latest"
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - User manager repository url
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "user_repo_url" {
  name      = "/${local.project_name}/repository_url/user_manager"
  type      = "String"
  value     = "${aws_ecr_repository.user.repository_url}:latest"
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
  name      = "/${local.project_name}/repository_url/resource_manager"
  type      = "String"
  value     = "${aws_ecr_repository.resource.repository_url}:latest"
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}
