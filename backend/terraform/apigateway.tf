# ---------------------------------------------------------------------------------------------
# API Gateway Authorizer - Authorization
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_authorizer" "this" {
  name                              = "Authorizer"
  api_id                            = local.apigateway_id
  authorizer_type                   = "REQUEST"
  authorizer_uri                    = aws_lambda_function.authorizer.invoke_arn
  authorizer_payload_format_version = "2.0"
  enable_simple_responses           = true
  authorizer_result_ttl_in_seconds  = 300
  identity_sources                  = ["$request.header.Authorization"]
}

# ---------------------------------------------------------------------------------------------
# API Gateway Authorizer - API Key
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_authorizer" "api_key" {
  name                              = "Authorizer_APIKey"
  api_id                            = local.apigateway_id
  authorizer_type                   = "REQUEST"
  authorizer_uri                    = aws_lambda_function.authorizer.invoke_arn
  authorizer_payload_format_version = "2.0"
  enable_simple_responses           = true
  authorizer_result_ttl_in_seconds  = 300
  identity_sources                  = ["$request.header.X-API-Key"]
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
# API Gateway Route - Resources
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "get_resources_all" {
  api_id             = local.apigateway_id
  route_key          = "GET /resources/services/{proxy+}"
  target             = "integrations/${local.apigateway_integration_resource}"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
  authorization_type = "CUSTOM"
}

resource "aws_apigatewayv2_route" "get_resources_categories" {
  api_id             = local.apigateway_id
  route_key          = "GET /resources/categories"
  target             = "integrations/${local.apigateway_integration_resource}"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
  authorization_type = "CUSTOM"
}

resource "aws_apigatewayv2_route" "get_resources_audit_region" {
  api_id             = local.apigateway_id
  route_key          = "GET /resources/audit/region"
  target             = "integrations/${local.apigateway_integration_resource}"
  authorizer_id      = aws_apigatewayv2_authorizer.api_key.id
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

resource "aws_apigatewayv2_route" "auth_initiate" {
  api_id    = local.apigateway_id
  route_key = "POST /auth/initiate"
  target    = "integrations/${local.apigateway_integration_auth}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - System
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "system_release_notes" {
  api_id    = local.apigateway_id
  route_key = "GET /system/releases"
  target    = "integrations/${local.apigateway_integration_auth}"
}

resource "aws_apigatewayv2_route" "system_version" {
  api_id    = local.apigateway_id
  route_key = "GET /system/version"
  target    = "integrations/${local.apigateway_integration_auth}"
}
