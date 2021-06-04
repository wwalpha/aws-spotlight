# ---------------------------------------------------------------------------------------------
# API Gateway Route - User
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_user_health" {
  api_id    = local.apigateway_id
  route_key = "GET /user/health"
  target    = "integrations/${local.apigateway_integration_user}"
}

resource "aws_apigatewayv2_route" "post_user" {
  api_id    = local.apigateway_id
  route_key = "POST /user"
  target    = "integrations/${local.apigateway_integration_user}"
  # authorizer_id      = local.apigateway_authorizer_id
  # authorization_type = "JWT"
}

resource "aws_apigatewayv2_route" "post_user_admin" {
  api_id    = local.apigateway_id
  route_key = "POST /user/admin"
  target    = "integrations/${local.apigateway_integration_user}"
  # authorizer_id      = local.apigateway_authorizer_id
  # authorization_type = "JWT"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - Resource
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_resource_health" {
  api_id    = local.apigateway_id
  route_key = "GET /resource/health"
  target    = "integrations/${local.apigateway_integration_resource}"
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
