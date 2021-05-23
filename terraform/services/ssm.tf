# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Environment variables
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "auth_envs" {
  name = "/${local.project_name}/environment/auth_manager"
  type = "String"
  value = jsonencode({
    ENV_VARS = "DUMMY"
  })
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}

# ----------------------------------------------------------------------------------------------
# SSM Parameter Store - Environment variables
# ----------------------------------------------------------------------------------------------
resource "aws_ssm_parameter" "resource_envs" {
  name = "/${local.project_name}/environment/resource_manager"
  type = "String"
  value = jsonencode({
    ENV_VARS = "DUMMY"
  })
  overwrite = true

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}

