# ----------------------------------------------------------------------------------------------
# AWS VPC
# ----------------------------------------------------------------------------------------------
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "${local.project_name}-vpc-${local.suffix}"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1d"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.3.0/24", "10.0.4.0/24"]

  enable_nat_gateway   = false
  enable_dns_hostnames = true
  enable_dns_support   = true
}

# ----------------------------------------------------------------------------------------------
# AWS Security Group
# ----------------------------------------------------------------------------------------------
resource "aws_security_group" "private_link" {
  name        = "allow_private"
  description = "allow_private"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_private"
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Security Group
# ----------------------------------------------------------------------------------------------
resource "aws_security_group" "alb" {
  name        = "alb_allow_http"
  description = "alb_allow_http"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "alb_allow_http"
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Security Group
# ----------------------------------------------------------------------------------------------
resource "aws_security_group" "batch" {
  name        = "batch_allow_http"
  description = "batch_allow_http"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "batch_allow_http"
  }
}

# # ----------------------------------------------------------------------------------------------
# # AWS Security Group - ECS
# # ----------------------------------------------------------------------------------------------
# resource "aws_security_group" "ecs_default_sg" {
#   name        = "allow_http"
#   description = "allow_http"
#   vpc_id      = module.vpc.vpc_id

#   ingress {
#     from_port   = 8080
#     to_port     = 8080
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     from_port   = 53
#     to_port     = 53
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     from_port   = 15000
#     to_port     = 15000
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = {
#     Name = "allow_http"
#   }
# }

# ----------------------------------------------------------------------------------------------
# AWS Security Group - Endpoint
# ----------------------------------------------------------------------------------------------
# resource "aws_security_group" "endpoint" {
#   name        = "allow_ecr"
#   description = "allow_ecr"
#   vpc_id      = module.vpc.vpc_id

#   ingress {
#     from_port   = 443
#     to_port     = 443
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     from_port   = 53
#     to_port     = 53
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     from_port   = 53
#     to_port     = 53
#     protocol    = "udp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = {
#     Name = "allow_ecr"
#   }
# }
