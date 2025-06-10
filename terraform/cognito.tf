# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool" "this" {
  name                     = "${local.project_name}_UserPool"
  auto_verified_attributes = ["email"]
  username_attributes      = ["email"]
  mfa_configuration        = "OPTIONAL"

  password_policy {
    minimum_length    = 10
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = true
  }

  software_token_mfa_configuration {
    enabled = true
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  schema {
    name                = "role"
    attribute_data_type = "String"
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool Client
# --------------------------------------------------------------------------------------------------------------
resource "awscc_cognito_user_pool_client" "this" {
  user_pool_id         = aws_cognito_user_pool.this.id
  client_name          = "SPAClient"
  generate_secret      = false
  callback_ur_ls       = ["http://localhost:5173/callback"]
  allowed_o_auth_flows = ["code"]
  allowed_o_auth_scopes = [
    "aws.cognito.signin.user.admin",
    "email",
    "openid",
    "phone",
    "profile"
  ]
  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  allowed_o_auth_flows_user_pool_client = true
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool Client Domain
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool_domain" "this" {
  domain                = "spotlight${awscc_cognito_user_pool_client.this.client_id}"
  user_pool_id          = aws_cognito_user_pool.this.id
  managed_login_version = 2
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito Managed Login Branding
# --------------------------------------------------------------------------------------------------------------
resource "awscc_cognito_managed_login_branding" "this" {
  user_pool_id = aws_cognito_user_pool.this.id
  client_id    = awscc_cognito_user_pool_client.this.client_id

  settings = jsonencode({})

  assets = [{
    category   = "PAGE_HEADER_LOGO"
    extension  = "PNG"
    bytes      = "iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGNzdGMTE3NDA3MjA2ODExOEMxNEE3NkIxRDhEMzU5RSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBQzU0OTI2RjY5MjAxMUUyQjM1OUE4QzQwMEM2QjM0MCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBQzU0OTI2RTY5MjAxMUUyQjM1OUE4QzQwMEM2QjM0MCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA1ODAxMTc0MDcyMDY4MTE4QzE0QTc2QjFEOEQzNTlFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY3N0YxMTc0MDcyMDY4MTE4QzE0QTc2QjFEOEQzNTlFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+SG1RYgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADqSURBVHjaYmRmYaSN4GVkYKKxASxMtDWAlYW2BrCy0tYANjbaGsDORlsDeNhpawAvO20N4OOgrQF8XLQ1gJ+btgYI8dLWAGFe2hogykdbA8T4aGuAOB9tDZDgo60BUvy0NUCWn7YGSAvQ1gAZAdoaICtIWwPkBGlrgIIQbQ1QFqatAWrCtDVAU4S2BmiJ0tYAHVHaGqArSlsDDMVpa4CROG0NMBanrQFmUrQ1wFKKtgbYStHWADsp2hrgJEVbA1ylqG0AP1MDCwsLjdMGAwM9i0pmNnoVlexspL0RebhobQAvUwAAAgwA3q4UUqwxJWsAAAAASUVORK5CYII="
    color_mode = "LIGHT"
  }]

  lifecycle {
    ignore_changes = [
      settings,
    ]
  }
}

