locals {
  # ----------------------------------------------------------------------------------------------
  # Environment
  # ----------------------------------------------------------------------------------------------
  suffix = random_id.this.hex

  # ----------------------------------------------------------------------------------------------
  # Project Informations
  # ----------------------------------------------------------------------------------------------
  project_name    = var.project_name
  project_name_uc = upper(var.project_name)

  # ----------------------------------------------------------------------------------------------
  # Dynamodb Tables
  # ----------------------------------------------------------------------------------------------
  dynamodb_name_event_type  = "${local.project_name}-eventtype-${local.suffix}"
  dynamodb_name_events      = "${local.project_name}-events-${local.suffix}"
  dynamodb_name_resources   = "${local.project_name}-resources-${local.suffix}"
  dynamodb_name_unprocessed = "${local.project_name}-unprocessed-${local.suffix}"
  dynamodb_name_history     = "${local.project_name}-histories-${local.suffix}"
  dynamodb_name_user        = "${local.project_name}-users-${local.suffix}"
  dynamodb_name_settings    = "${local.project_name}-settings-${local.suffix}"
  dynamodb_name_ignores     = "${local.project_name}-ignores-${local.suffix}"

  # ----------------------------------------------------------------------------------------------
  # S3 Bucket
  # ----------------------------------------------------------------------------------------------
  bucket_name_frontend    = "${var.project_name}-frontend-${local.suffix}"
  bucket_name_environment = "${var.project_name}-environment-${local.suffix}"
  bucket_name_archive     = "${var.project_name}-archive-${local.suffix}"
  mime_types = {
    htm   = "text/html"
    html  = "text/html"
    css   = "text/css"
    js    = "application/javascript"
    map   = "application/javascript"
    json  = "application/json"
    png   = "image/png"
    svg   = "image/svg+xml"
    "ico" = "image/x-icon"
  }
}

# ----------------------------------------------------------------------------------------------
# AWS REGION
# ----------------------------------------------------------------------------------------------
data "aws_region" "this" {}

# ----------------------------------------------------------------------------------------------
# Bucket Random Id
# ----------------------------------------------------------------------------------------------
resource "random_id" "this" {
  byte_length = 3
}
