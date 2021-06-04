# ---------------------------------------------------------------------------------------------
# API Gateway Route - GET /user/health
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_user_health" {
  api_id    = local.apigateway_id
  route_key = "GET /user/health"
  target    = "integrations/${local.apigateway_integration_user}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /user
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_user" {
  api_id    = local.apigateway_id
  route_key = "POST /user"
  target    = "integrations/${local.apigateway_integration_user}"
  # authorizer_id      = local.apigateway_authorizer_id
  # authorization_type = "JWT"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /user/admin
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_user_admin" {
  api_id    = local.apigateway_id
  route_key = "POST /user/admin"
  target    = "integrations/${local.apigateway_integration_user}"
  # authorizer_id      = local.apigateway_authorizer_id
  # authorization_type = "JWT"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - GET /resource/health
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_resource_health" {
  api_id    = local.apigateway_id
  route_key = "GET /resource/health"
  target    = "integrations/${local.apigateway_integration_resource}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - GET /auth/health
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_auth_health" {
  api_id    = local.apigateway_id
  route_key = "GET /auth/health"
  target    = "integrations/${local.apigateway_integration_auth}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /auth/signin
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "post_auth_signin" {
  api_id    = local.apigateway_id
  route_key = "POST /auth/signin"
  target    = "integrations/${local.apigateway_integration_auth}"
}

# resource "aws_apigatewayv2_route" "http_options" {
#   api_id    = local.apigateway_id
#   route_key = "OPTIONS /{proxy+}"
#   target    = "integrations/${aws_apigatewayv2_integration.resource.id}"
# }
