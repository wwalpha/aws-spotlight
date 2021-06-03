# # ----------------------------------------------------------------------------------------------
# # Application Load Balancer
# # ----------------------------------------------------------------------------------------------
# resource "aws_lb" "this" {
#   name               = "${local.project_name}-alb"
#   internal           = false
#   load_balancer_type = "application"
#   security_groups    = [aws_security_group.alb.id]
#   subnets            = module.vpc.public_subnets
# }

# # ----------------------------------------------------------------------------------------------
# # Application Load Balancer Target Group - Resource
# # ----------------------------------------------------------------------------------------------
# resource "aws_lb_target_group" "resource" {
#   name_prefix                        = "resour"
#   port                               = 8080
#   protocol                           = "HTTP"
#   target_type                        = "ip"
#   vpc_id                             = module.vpc.vpc_id
#   lambda_multi_value_headers_enabled = false
#   proxy_protocol_v2                  = false

#   health_check {
#     enabled             = true
#     healthy_threshold   = 5
#     interval            = 30
#     matcher             = "200"
#     path                = "/resources/health"
#     port                = "8080"
#     protocol            = "HTTP"
#     timeout             = 5
#     unhealthy_threshold = 2
#   }

#   lifecycle {
#     create_before_destroy = true
#   }
# }

# # ----------------------------------------------------------------------------------------------
# # Application Load Balancer Target Group
# # ----------------------------------------------------------------------------------------------
# resource "aws_lb_listener" "this" {
#   depends_on = [
#     aws_lb_target_group.resource
#   ]
#   load_balancer_arn = aws_lb.this.arn
#   port              = "80"
#   protocol          = "HTTP"
#   # port              = "443"
#   # protocol          = "HTTPS"
#   # ssl_policy        = "ELBSecurityPolicy-2016-08"
#   # certificate_arn   = aws_acm_certificate.api.arn

#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.resource.arn
#   }
# }
