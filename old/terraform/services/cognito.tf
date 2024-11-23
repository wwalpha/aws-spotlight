# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool" "this" {
  name                     = "${local.project_name}-admin${local.suffix}"
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]
  mfa_configuration        = "OFF"

  username_configuration {
    case_sensitive = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  admin_create_user_config {
    allow_admin_create_user_only = true

    # temporary_password_validity_days = "${var.unused_account_validity_days}"

    # invite_message_template {
    #   email_subject = var.invite_email_subject
    #   email_message = var.invite_email_message
    #   sms_message   = var.invite_sms_message
    # }
  }

  schema {
    name                     = "email"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true

    string_attribute_constraints {
      max_length = 2048
      min_length = 0
    }
  }

  schema {
    name                     = "name"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true

    string_attribute_constraints {
      max_length = 2048
      min_length = 0
    }
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

  # device_configuration {
  #   challenge_required_on_new_device      = var.challenge_required_on_new_device
  #   device_only_remembered_on_user_prompt = var.device_only_remembered_on_user_prompt
  # }

  # email_configuration {
  #   reply_to_email_address = var.reply_to_email_address
  #   source_arn             = var.email_source_arn
  # }

  # lambda_config {
  #   create_auth_challenge          = var.create_auth_challenge
  #   custom_message                 = var.custom_message
  #   define_auth_challenge          = var.define_auth_challenge
  #   post_authentication            = var.post_authentication
  #   post_confirmation              = var.post_confirmation
  #   pre_authentication             = var.pre_authentication
  #   pre_sign_up                    = var.pre_sign_up
  #   pre_token_generation           = var.pre_token_generation
  #   user_migration                 = var.user_migration
  #   verify_auth_challenge_response = var.verify_auth_challenge_response
  # }

  password_policy {
    minimum_length                   = 10
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }

  # dynamic "sms_configuration" {
  #   for_each = local.sms_configuration

  #   content {
  #     external_id    = sms_configuration.value.external_id
  #     sns_caller_arn = sms_configuration.value.sns_caller_arn
  #   }
  # }

  # user_pool_add_ons {
  #   advanced_security_mode = var.advanced_security_mode
  # }

  # verification_message_template {
  #   default_email_option  = var.verify_default_email_option
  #   email_message         = var.verify_email_message
  #   email_message_by_link = var.verify_email_message_by_link
  #   email_subject         = var.verify_email_subject
  #   email_subject_by_link = var.verify_email_subject_by_link
  #   sms_message           = var.verify_sms_message
  # }
}

# -------------------------------------------------------
# Amazon Cognito User Pool Client
# -------------------------------------------------------
resource "aws_cognito_user_pool_client" "this" {
  name = "${aws_cognito_user_pool.this.name}Client"

  user_pool_id    = aws_cognito_user_pool.this.id
  generate_secret = false

  allowed_oauth_flows                  = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "aws.cognito.signin.user.admin",
    "email",
    "openid",
    "phone",
    "profile"
  ]
  callback_urls = ["http://localhost:3000/login"]
  logout_urls   = ["http://localhost:3000/logout"]
  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
  ]

  # default_redirect_uri                 = var.default_redirect_uri
  # read_attributes                      = var.read_attributes
  # refresh_token_validity               = var.refresh_token_validity
  # supported_identity_providers         = var.supported_identity_providers
  # write_attributes                     = var.write_attributes
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool Client Domain
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool_domain" "this" {
  domain       = "${local.project_name}-admin${local.suffix}"
  user_pool_id = aws_cognito_user_pool.this.id
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito Identity Pool
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_identity_pool" "this" {
  identity_pool_name = "${local.project_name}-admin${local.suffix}"

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.this.id
    provider_name           = aws_cognito_user_pool.this.endpoint
    server_side_token_check = false
  }
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito Identity Pool Role Attachment
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_identity_pool_roles_attachment" "this" {
  identity_pool_id = aws_cognito_identity_pool.this.id

  # role_mapping {
  #   identity_provider         = "graph.facebook.com"
  #   ambiguous_role_resolution = "AuthenticatedRole"
  #   type                      = "Rules"

  #   mapping_rule {
  #     claim      = "isAdmin"
  #     match_type = "Equals"
  #     role_arn   = aws_iam_role.cognito_authenticated.arn
  #     value      = "paid"
  #   }
  # }

  roles = {
    "authenticated" = aws_iam_role.cognito_authenticated.arn
  }
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool" "user" {
  name                     = "${local.project_name}-user${local.suffix}"
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]
  mfa_configuration        = "OFF"

  username_configuration {
    case_sensitive = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }


  admin_create_user_config {
    allow_admin_create_user_only = true
  }

  password_policy {
    minimum_length                   = 10
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }

  schema {
    name                     = "email"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true

    string_attribute_constraints {
      max_length = 2048
      min_length = 0
    }
  }

  schema {
    name                     = "name"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true

    string_attribute_constraints {
      max_length = 2048
      min_length = 0
    }
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
}

# -------------------------------------------------------
# Amazon Cognito User Pool Client
# -------------------------------------------------------
resource "aws_cognito_user_pool_client" "user" {
  name = "${aws_cognito_user_pool.this.name}Client"

  user_pool_id    = aws_cognito_user_pool.this.id
  generate_secret = false

  allowed_oauth_flows                  = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "aws.cognito.signin.user.admin",
    "email",
    "openid",
    "phone",
    "profile"
  ]
  callback_urls = ["http://localhost:3000/login"]
  logout_urls   = ["http://localhost:3000/logout"]
  explicit_auth_flows = [
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool Client Domain
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool_domain" "user" {
  domain       = "${local.project_name}-user${local.suffix}"
  user_pool_id = aws_cognito_user_pool.user.id
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito Identity Pool
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_identity_pool" "user" {
  identity_pool_name = "${local.project_name}-user${local.suffix}"

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.user.id
    provider_name           = aws_cognito_user_pool.user.endpoint
    server_side_token_check = false
  }
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito Identity Pool Role Attachment
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_identity_pool_roles_attachment" "user" {
  identity_pool_id = aws_cognito_identity_pool.user.id

  roles = {
    "authenticated" = aws_iam_role.cognito_authenticated.arn
  }
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito Admin User
# --------------------------------------------------------------------------------------------------------------
resource "null_resource" "cognito_admin" {
  triggers = {
    user_pool_id = aws_cognito_user_pool.this.id
  }

  provisioner "local-exec" {
    command = "aws cognito-idp admin-create-user --region ${local.region} --user-pool-id ${aws_cognito_user_pool.this.id} --username ${var.admin_email} --user-attributes Name=email,Value=${var.admin_email} Name=name,Value=${var.admin_email} Name=custom:role,Value=TENANT_ADMIN"
  }
}
