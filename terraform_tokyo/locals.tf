locals {
  project_name = "admin"
  region       = data.aws_region.this.name
  account_id   = data.aws_caller_identity.this.account_id
  isDev        = terraform.workspace == "dev" ? true : false

  lambda_default_content = <<EOT
exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
EOT
}

# ----------------------------------------------------------------------------------------------
# AWS Region
# ----------------------------------------------------------------------------------------------
data "aws_region" "this" {}

# ----------------------------------------------------------------------------------------------
# AWS Account ID
# ----------------------------------------------------------------------------------------------
data "aws_caller_identity" "this" {}
