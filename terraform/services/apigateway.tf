# ---------------------------------------------------------------------------------------------
# API Gateway
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_api" "this" {
  name          = "${local.project_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    # allow_origins = [
    #   local.is_dev ? "*" : "https://${aws_acm_certificate.web.domain_name}"
    # ]
    allow_origins = ["*"]
    allow_headers = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Authorizer
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_authorizer" "this" {
  api_id           = aws_apigatewayv2_api.this.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "Cognito"

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.this.id]
    issuer   = "https://${aws_cognito_user_pool.this.endpoint}"
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Stage
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_stage" "this" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api.arn
    format = jsonencode(
      {
        httpMethod     = "$context.httpMethod"
        ip             = "$context.identity.sourceIp"
        protocol       = "$context.protocol"
        requestId      = "$context.requestId"
        requestTime    = "$context.requestTime"
        responseLength = "$context.responseLength"
        routeKey       = "$context.routeKey"
        status         = "$context.status"
      }
    )
  }
}

# # ---------------------------------------------------------------------------------------------
# # API Gateway Domain Name
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_domain_name" "this" {
#   depends_on  = [aws_acm_certificate_validation.api]
#   domain_name = "api.${local.domain_name}"

#   domain_name_configuration {
#     certificate_arn = aws_acm_certificate.api.arn
#     endpoint_type   = "REGIONAL"
#     security_policy = "TLS_1_2"
#   }
# }

# # ---------------------------------------------------------------------------------------------
# # API Gateway Domain API Mapping
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_api_mapping" "this" {
#   api_id      = aws_apigatewayv2_api.this.id
#   domain_name = "api.${local.domain_name}"
#   stage       = aws_apigatewayv2_stage.this.id
# }

# # ---------------------------------------------------------------------------------------------
# # API Gateway VPC Link
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_vpc_link" "this" {
#   name               = "${local.project_name}-link"
#   security_group_ids = [aws_security_group.private_link[0].id]
#   subnet_ids         = module.vpc.public_subnets

#   count = local.normal
# }

# # ---------------------------------------------------------------------------------------------
# # API Gateway Integration - VPC_LINK
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_integration" "link" {
#   api_id             = aws_apigatewayv2_api.this.id
#   connection_type    = "VPC_LINK"
#   connection_id      = aws_apigatewayv2_vpc_link.this[0].id
#   integration_method = "ANY"
#   integration_type   = "HTTP_PROXY"
#   integration_uri    = aws_lb_listener.this.arn
#   # integration_uri    = aws_service_discovery_service.this.arn

#   count = local.normal
# }

# # ---------------------------------------------------------------------------------------------
# # API Gateway Route
# # ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_route" "link" {
#   api_id    = aws_apigatewayv2_api.this.id
#   route_key = "ANY /{proxy+}"

#   target = "integrations/${aws_apigatewayv2_integration.link[0].id}"

#   count = local.normal
# }

# ---------------------------------------------------------------------------------------------
# API Gateway Integration - HTTP URI
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "http" {
  api_id             = aws_apigatewayv2_api.this.id
  connection_type    = "INTERNET"
  integration_method = "ANY"
  integration_type   = "HTTP_PROXY"
  integration_uri    = "http://${aws_lb.this.dns_name}/{proxy}"
  # integration_uri    = "${aws_lb_listener.this.protocol}://backend.${local.domain_name}/{proxy}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "http_post" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /{proxy+}"
  target             = "integrations/${aws_apigatewayv2_integration.http.id}"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "http_get" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /{proxy+}"
  target             = "integrations/${aws_apigatewayv2_integration.http.id}"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "http_put" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "PUT /{proxy+}"
  target             = "integrations/${aws_apigatewayv2_integration.http.id}"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "http_delete" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "DELETE /{proxy+}"
  target             = "integrations/${aws_apigatewayv2_integration.http.id}"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
  authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "http_options" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "OPTIONS /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.http.id}"
}
