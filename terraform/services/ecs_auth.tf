# ----------------------------------------------------------------------------------------------
# ECS Cluster
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_cluster" "this" {
  name = "${local.project_name}-cluster"

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 0
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
  }

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ----------------------------------------------------------------------------------------------
# AWS ECS Service - Token Service Task Definition
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_task_definition" "auth" {
  depends_on         = [null_resource.demo]
  family             = local.task_def_family_auth
  task_role_arn      = aws_iam_role.ecs_task.arn
  execution_role_arn = aws_iam_role.ecs_task_exec.arn
  network_mode       = "awsvpc"
  cpu                = "256"
  memory             = "512"

  requires_compatibilities = [
    "FARGATE"
  ]

  container_definitions = templatefile(
    "taskdefs/definition.tpl",
    {
      aws_region      = local.region
      container_name  = local.task_def_family_auth
      container_image = data.aws_ssm_parameter.auth_repo_url.value
      container_port  = 8080
      env_file_arn    = "${data.aws_s3_bucket.environment.arn}/${aws_s3_bucket_object.auth.key}"
      # app_mesh_node     = split(":", aws_appmesh_virtual_node.token.arn)[5]
      # dynamodb_tables   = aws_ssm_parameter.tables.arn
      # service_endpoints = aws_ssm_parameter.endpoints.arn
    }
  )

  provisioner "local-exec" {
    when    = destroy
    command = "sh ${path.module}/scripts/deregister-taskdef.sh ${self.family}"
  }
}

# ----------------------------------------------------------------------------------------------
# ECS Service - Backend Service
# ----------------------------------------------------------------------------------------------
resource "aws_ecs_service" "auth_manager" {
  name                               = "auth_manager"
  cluster                            = aws_ecs_cluster.this.id
  desired_count                      = 0
  platform_version                   = "1.4.0"
  task_definition                    = "arn:aws:ecs:${local.region}:${local.account_id}:task-definition/${aws_ecs_task_definition.auth.family}:${local.task_def_rev_auth}"
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  health_check_grace_period_seconds  = 0
  wait_for_steady_state              = false

  capacity_provider_strategy {
    base              = 0
    weight            = 1
    capacity_provider = "FARGATE_SPOT"
  }

  deployment_circuit_breaker {
    enable   = false
    rollback = false
  }

  deployment_controller {
    type = "ECS"
  }

  network_configuration {
    assign_public_ip = local.is_dev
    subnets          = local.is_dev ? module.vpc.public_subnets : module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_default_sg.id]
  }

  # load_balancer {
  #   container_name   = local.task_def_family_auth
  #   container_port   = 8080
  #   target_group_arn = aws_lb_target_group.this.arn
  # }

  scheduling_strategy = "REPLICA"

  # service_registries {
  #   registry_arn   = aws_service_discovery_service.this.arn
  #   container_port = 0
  #   port           = 0
  # }

  # provisioner "local-exec" {
  #   when    = destroy
  #   command = "sh ${path.module}/scripts/servicediscovery-drain.sh ${split("/", self.service_registries[0].registry_arn)[1]}"
  # }

  lifecycle {
    ignore_changes = [
      desired_count
    ]
  }
}
