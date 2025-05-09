locals {
  project_name = "spotlight"
  environment  = terraform.workspace == "dev" ? "dev" : "prod"
  region       = data.aws_region.this.name
  account_id   = data.aws_caller_identity.this.account_id

  # ----------------------------------------------------------------------------------------------
  # Dynamodb Tables
  # ----------------------------------------------------------------------------------------------
  dynamodb_name_remain = "${local.project_name}-remain-${local.environment}"

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

data "archive_file" "default" {
  type        = "zip"
  output_path = "${path.module}/dist/default.zip"

  source {
    content  = local.lambda_default_content
    filename = "index.js"
  }
}
