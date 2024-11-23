# ---------------------------------------------------------------------------------------------
# API Gateway
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_api" "this" {
  name          = "${local.project_name}-api-${local.suffix}"
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

# ---------------------------------------------------------------------------------------------
# API Gateway Domain Name
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_domain_name" "this" {
  depends_on  = [aws_acm_certificate_validation.this]
  domain_name = "api.${local.domain_name}"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.this.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Domain API Mapping
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_api_mapping" "this" {
  api_id      = aws_apigatewayv2_api.this.id
  domain_name = aws_apigatewayv2_domain_name.this.domain_name
  stage       = aws_apigatewayv2_stage.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway VPC Link
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_vpc_link" "this" {
  name               = "${local.project_name}-link-${local.suffix}"
  security_group_ids = [aws_security_group.private_link.id]
  subnet_ids         = module.vpc.public_subnets
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration - Auth
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "auth" {
  api_id             = aws_apigatewayv2_api.this.id
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.this.id
  integration_method = "ANY"
  integration_type   = "HTTP_PROXY"
  integration_uri    = aws_service_discovery_service.auth.arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration - Resource
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "resource" {
  api_id             = aws_apigatewayv2_api.this.id
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.this.id
  integration_method = "ANY"
  integration_type   = "HTTP_PROXY"
  integration_uri    = aws_service_discovery_service.resource.arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration - Token
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "token" {
  api_id             = aws_apigatewayv2_api.this.id
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.this.id
  integration_method = "ANY"
  integration_type   = "HTTP_PROXY"
  integration_uri    = aws_service_discovery_service.token.arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration - User
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "user" {
  api_id             = aws_apigatewayv2_api.this.id
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.this.id
  integration_method = "ANY"
  integration_type   = "HTTP_PROXY"
  integration_uri    = aws_service_discovery_service.user.arn
}

