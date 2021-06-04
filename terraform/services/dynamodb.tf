# ----------------------------------------------------------------------------------------------
# Dynamodb Table Item - Cognito Admin
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table_item" "admin" {
  table_name = data.aws_dynamodb_table.users.name
  hash_key   = data.aws_dynamodb_table.users.hash_key

  item = <<ITEM
{
  "UserId": {"S": "${var.admin_email}"},
  "UserName": {"S": "${var.admin_email}"},
  "Email": {"S": "${var.admin_email}"},
  "Role": {"S": "TENANT_ADMIN"}
}
ITEM

}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table Item - Cognito Admin
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table_item" "cognito_admin" {
  table_name = data.aws_dynamodb_table.settings.name
  hash_key   = data.aws_dynamodb_table.settings.hash_key

  item = <<ITEM
{
  "Id": {"S": "TENANT_ADMIN"},
  "UserPoolId": {"S": "${aws_cognito_user_pool.this.id}"},
  "ClientId": {"S": "${aws_cognito_user_pool_client.this.id}"},
  "IdentityPoolId": {"S": "${aws_cognito_identity_pool.this.id}"}
}
ITEM

}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table Item - Cognito User
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table_item" "cognito_user" {
  table_name = data.aws_dynamodb_table.settings.name
  hash_key   = data.aws_dynamodb_table.settings.hash_key

  item = <<ITEM
{
  "Id": {"S": "TENANT_USER"},
  "UserPoolId": {"S": "${aws_cognito_user_pool.user.id}"},
  "ClientId": {"S": "${aws_cognito_user_pool_client.user.id}"},
  "IdentityPoolId": {"S": "${aws_cognito_identity_pool.user.id}"}
}
ITEM

}
