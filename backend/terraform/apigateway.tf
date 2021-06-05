# ---------------------------------------------------------------------------------------------
# API Gateway Authorizer
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_authorizer" "this" {
  name                              = "Authorizer"
  api_id                            = local.apigateway_id
  authorizer_type                   = "REQUEST"
  authorizer_uri                    = aws_lambda_function.authorizer.invoke_arn
  identity_sources                  = ["$request.header.Authorization"]
  authorizer_payload_format_version = "2.0"
  enable_simple_responses           = true
  authorizer_result_ttl_in_seconds  = 300
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - User
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_users_health" {
  api_id    = local.apigateway_id
  route_key = "GET /users/health"
  target    = "integrations/${local.apigateway_integration_user}"
}

resource "aws_apigatewayv2_route" "post_users" {
  api_id             = local.apigateway_id
  route_key          = "POST /users"
  target             = "integrations/${local.apigateway_integration_user}"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
  authorization_type = "CUSTOM"
}

resource "aws_apigatewayv2_route" "post_users_admin" {
  api_id             = local.apigateway_id
  route_key          = "POST /users/admins"
  target             = "integrations/${local.apigateway_integration_user}"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
  authorization_type = "CUSTOM"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Resource
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_resources_health" {
  api_id    = local.apigateway_id
  route_key = "GET /resources/health"
  target    = "integrations/${local.apigateway_integration_resource}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Resource
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_resources_all" {
  api_id             = local.apigateway_id
  route_key          = "GET /resources/{proxy+}"
  target             = "integrations/${local.apigateway_integration_resource}"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
  authorization_type = "CUSTOM"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Auth
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_auth_health" {
  api_id    = local.apigateway_id
  route_key = "GET /auth/health"
  target    = "integrations/${local.apigateway_integration_auth}"
}

resource "aws_apigatewayv2_route" "post_auth" {
  api_id    = local.apigateway_id
  route_key = "POST /auth"
  target    = "integrations/${local.apigateway_integration_auth}"
}

# resource "aws_apigatewayv2_route" "http_options" {
#   api_id    = local.apigateway_id
#   route_key = "OPTIONS /{proxy+}"
#   target    = "integrations/${aws_apigatewayv2_integration.resource.id}"
# }
