# ---------------------------------------------------------------------------------------------
# API Gateway Route
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "user_health" {
  api_id    = local.apigateway_id
  route_key = "GET /user/health"
  target    = "integrations/${local.apigateway_integration_user}"
}

# resource "aws_apigatewayv2_route" "http_post" {
#   api_id             = local.api_gateway_id
#   route_key          = "POST /{proxy+}"
#   target             = "integrations/${local.api_gateway_integration_resource}"
#   authorizer_id      = local.apigateway_authorizer_id
#   authorization_type = "JWT"
# }

# resource "aws_apigatewayv2_route" "http_get" {
#   api_id             = local.apigateway_id
#   route_key          = "GET /{proxy+}"
#   target             = "integrations/${aws_apigatewayv2_integration.resource.id}"
#   authorizer_id      = local.apigateway_authorizer_id
#   authorization_type = "JWT"
# }

# resource "aws_apigatewayv2_route" "http_put" {
#   api_id             = local.apigateway_id
#   route_key          = "PUT /{proxy+}"
#   target             = "integrations/${aws_apigatewayv2_integration.resource.id}"
#   authorizer_id      = local.apigateway_authorizer_id
#   authorization_type = "JWT"
# }

# resource "aws_apigatewayv2_route" "http_delete" {
#   api_id             = local.apigateway_id
#   route_key          = "DELETE /{proxy+}"
#   target             = "integrations/${aws_apigatewayv2_integration.resource.id}"
#   authorizer_id      = local.apigateway_authorizer_id
#   authorization_type = "JWT"
# }

# resource "aws_apigatewayv2_route" "http_options" {
#   api_id    = local.apigateway_id
#   route_key = "OPTIONS /{proxy+}"
#   target    = "integrations/${aws_apigatewayv2_integration.resource.id}"
# }
