# ---------------------------------------------------------------------------------------------
# CloudWatch Log Group - API Gateway
# ---------------------------------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "api" {
  name              = "/${local.project_name}/api"
  retention_in_days = 7
}
