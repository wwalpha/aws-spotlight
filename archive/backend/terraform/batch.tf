# ----------------------------------------------------------------------------------------------
# AWS Batch Job Definition
# ----------------------------------------------------------------------------------------------
# resource "aws_batch_job_definition" "cloudtrail" {
#   name = "${local.project_name}-job-cloudtrail"
#   type = "container"
#   platform_capabilities = [
#     "FARGATE",
#   ]

#   timeout {
#     attempt_duration_seconds = 600
#   }

#   container_properties = jsonencode({
#     command = ["hello world"]
#     environment = [
#       {
#         name  = "TEST"
#         value = "111"
#       }
#     ]
#     image      = "${local.ecr_repository_url_batch_cloudtrail}:latest"
#     jobRoleArn = aws_iam_role.batch_job.arn
#     fargatePlatformConfiguration = {
#       platformVersion = "1.4.0"
#     }
#     networkConfiguration = {
#       assignPublicIp = "DISABLED"
#     }
#     resourceRequirements = [
#       {
#         type  = "VCPU"
#         value = "0.25"
#       },
#       {
#         type  = "MEMORY"
#         value = "512"
#       }
#     ]
#     executionRoleArn = aws_iam_role.batch_exec.arn
#     logConfiguration = {
#       logDriver     = "awslogs"
#       options       = {}
#       secretOptions = []
#     }
#     mountPoints = []
#     secrets     = []
#     ulimits     = []
#     volumes     = []
#   })
# }

