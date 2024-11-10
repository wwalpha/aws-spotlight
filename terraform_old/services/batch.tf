# # ----------------------------------------------------------------------------------------------
# # AWS Batch Compute Environment
# # ----------------------------------------------------------------------------------------------
# resource "aws_batch_compute_environment" "this" {
#   compute_environment_name = "${local.project_name}-fargate-env"
#   type                     = "MANAGED"
#   service_role             = aws_iam_role.batch_service.arn

#   compute_resources {
#     type      = "FARGATE_SPOT"
#     max_vcpus = 4

#     security_group_ids = [
#       aws_security_group.batch.id
#     ]

#     subnets = module.vpc.private_subnets
#   }
# }

# # ----------------------------------------------------------------------------------------------
# # AWS Batch Job Queue
# # ----------------------------------------------------------------------------------------------
# resource "aws_batch_job_queue" "this" {
#   name     = "${local.project_name}-job-queue"
#   state    = "ENABLED"
#   priority = 1
#   compute_environments = [
#     aws_batch_compute_environment.this.arn,
#   ]
# }
