# ----------------------------------------------------------------------------------------------
# API Gateway REST API
# ----------------------------------------------------------------------------------------------
resource "aws_api_gateway_rest_api" "this" {
  name = "${local.project_name}-api-${local.environment}"
}

# ----------------------------------------------------------------------------------------------
# API Gateway Authorizer - Cognito
# ----------------------------------------------------------------------------------------------
resource "aws_api_gateway_authorizer" "this" {
  name            = "cognito"
  rest_api_id     = aws_api_gateway_rest_api.this.id
  authorizer_uri  = "arn:aws:apigateway:us-east-1:cognito-idp:path/userpools/${aws_cognito_user_pool.this.id}/authorizers"
  identity_source = "method.request.header.Authorization"
  type            = "COGNITO_USER_POOLS"
  provider_arns   = [aws_cognito_user_pool.this.arn]
}

# ----------------------------------------------------------------------------------------------
# API Gateway REST API Resource - Report
# ----------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "report" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "report"
}

# ----------------------------------------------------------------------------------------------
# API Gateway REST API Method - Report (POST)
# ----------------------------------------------------------------------------------------------
resource "aws_api_gateway_method" "report_post" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.report.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.this.id
}

# ----------------------------------------------------------------------------------------------
# API Gateway REST API Integratoin - Report (POST)
# ----------------------------------------------------------------------------------------------
resource "aws_api_gateway_integration" "report" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.report.id
  http_method             = aws_api_gateway_method.report_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.report.invoke_arn
}

# ----------------------------------------------------------------------------------------------
# API Gateway REST API Resource - Renewal
# ----------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "renewal" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "renewal"
}

# ----------------------------------------------------------------------------------------------
# API Gateway REST API Method - Renewal (POST)
# ----------------------------------------------------------------------------------------------
resource "aws_api_gateway_method" "renewal_post" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.renewal.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.this.id
}

# ----------------------------------------------------------------------------------------------
# API Gateway REST API Integratoin - Renewal (POST)
# ----------------------------------------------------------------------------------------------
resource "aws_api_gateway_integration" "renewal" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.renewal.id
  http_method             = aws_api_gateway_method.renewal_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.renewal.invoke_arn
}

# ----------------------------------------------------------------------------------------------
# API Gateway Deployment
# ----------------------------------------------------------------------------------------------
resource "aws_api_gateway_deployment" "this" {
  depends_on  = [aws_api_gateway_integration.report]
  rest_api_id = aws_api_gateway_rest_api.this.id
}

# ----------------------------------------------------------------------------------------------
# API Gateway REST API Stage
# ----------------------------------------------------------------------------------------------
resource "aws_api_gateway_stage" "this" {
  deployment_id = aws_api_gateway_deployment.this.id
  rest_api_id   = aws_api_gateway_rest_api.this.id
  stage_name    = "v1"
}

# ----------------------------------------------------------------------------------------------
# API Gateway REST API Key
# ----------------------------------------------------------------------------------------------
resource "aws_api_gateway_api_key" "this" {
  name    = "${local.project_name}-apikey-${local.environment}"
  enabled = true
}

# ----------------------------------------------------------------------------------------------
# API Gateway REST Usage Plan
# ----------------------------------------------------------------------------------------------
resource "aws_api_gateway_usage_plan" "this" {
  name = "${local.project_name}-usage-plan-${local.environment}"

  api_stages {
    api_id = aws_api_gateway_rest_api.this.id
    stage  = aws_api_gateway_stage.this.stage_name
  }

  throttle_settings {
    burst_limit = 2
    rate_limit  = 10
  }
}

# ----------------------------------------------------------------------------------------------
# API Gateway REST Usage Plan Key
# ----------------------------------------------------------------------------------------------
resource "aws_api_gateway_usage_plan_key" "this" {
  key_id        = aws_api_gateway_api_key.this.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.this.id
}
