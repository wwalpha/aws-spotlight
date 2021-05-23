# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito User Pool
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_user_pool" "this" {
  name = "${local.project_name_uc}_UserPool"

  auto_verified_attributes = ["email"]
  mfa_configuration        = "OPTIONAL"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  software_token_mfa_configuration {
    enabled = true
  }
  # alias_attributes           = var.alias_attributes
  # auto_verified_attributes   = local.auto_verified_attributes
  # mfa_configuration          = var.mfa_configuration
  # email_verification_subject = var.email_verification_subject
  # email_verification_message = var.email_verification_message
  # sms_authentication_message = var.sms_authentication_message
  # sms_verification_message   = var.sms_verification_message
  # username_attributes        = var.username_attributes
  # tags                       = var.user_pool_tags

  admin_create_user_config {
    allow_admin_create_user_only = false

    # temporary_password_validity_days = "${var.unused_account_validity_days}"

    # invite_message_template {
    #   email_subject = var.invite_email_subject
    #   email_message = var.invite_email_message
    #   sms_message   = var.invite_sms_message
    # }
  }

  # dynamic "schema" {
  #   for_each = var.schema

  #   content {
  #     name                     = schema.value.name
  #     attribute_data_type      = schema.value.attribute_data_type
  #     developer_only_attribute = schema.value.developer_only_attribute
  #     mutable                  = schema.value.mutable
  #     required                 = schema.value.required

  #     string_attribute_constraints {
  #       max_length = schema.value.string_attribute_max_length
  #       min_length = schema.value.string_attribute_min_length
  #     }
  #   }
  # }

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

  # password_policy {
  #   minimum_length    = var.password_minimum_length
  #   require_lowercase = var.password_require_lowercase
  #   require_numbers   = var.password_require_numbers
  #   require_symbols   = var.password_require_symbols
  #   require_uppercase = var.password_require_uppercase
  # }

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
  # supported_identity_providers = ["Cognito"]
  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
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
  domain       = "${terraform.workspace}-${local.project_name}"
  user_pool_id = aws_cognito_user_pool.this.id
}

# --------------------------------------------------------------------------------------------------------------
# Amazon Cognito Identity Pool
# --------------------------------------------------------------------------------------------------------------
resource "aws_cognito_identity_pool" "this" {
  identity_pool_name = "${local.project_name_uc}_IdentityPool"

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
