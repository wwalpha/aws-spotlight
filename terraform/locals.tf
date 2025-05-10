locals {
  environment  = terraform.workspace == "dev" ? "dev" : "prod"
  project_name = "spotlight"
  region       = data.aws_region.this.name
  account_id   = data.aws_caller_identity.this.account_id
  isDev        = terraform.workspace == "dev" ? true : false

  # ----------------------------------------------------------------------------------------------
  # Dynamodb Tables
  # ----------------------------------------------------------------------------------------------
  dynamodb_name_event_type  = "${local.project_name}-eventtype-${local.environment}"
  dynamodb_name_events      = "${local.project_name}-events-${local.environment}"
  dynamodb_name_resources   = "${local.project_name}-resources-${local.environment}"
  dynamodb_name_unprocessed = "${local.project_name}-unprocessed-${local.environment}"
  dynamodb_name_user        = "${local.project_name}-users-${local.environment}"
  dynamodb_name_settings    = "${local.project_name}-settings-${local.environment}"
  dynamodb_name_extend      = "${local.project_name}-extend-${local.environment}"

  # ----------------------------------------------------------------------------------------------
  # S3 Bucket
  # ----------------------------------------------------------------------------------------------
  bucket_name_material = "${local.project_name}-material-${local.region}-${local.environment}"


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

# ----------------------------------------------------------------------------------------------
# CloudTrail Latest Image ID
# ----------------------------------------------------------------------------------------------
data "aws_ecr_image" "cloudtrail" {
  depends_on      = [null_resource.cloudtrail]
  repository_name = aws_ecr_repository.cloudtrail.name
  image_tag       = "latest"
}

# ----------------------------------------------------------------------------------------------
# Report Latest Image ID
# ----------------------------------------------------------------------------------------------
data "aws_ecr_image" "report" {
  depends_on      = [null_resource.report]
  repository_name = aws_ecr_repository.report.name
  image_tag       = "latest"
}
