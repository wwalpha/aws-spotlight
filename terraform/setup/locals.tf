locals {
  # ----------------------------------------------------------------------------------------------
  # Environment
  # ----------------------------------------------------------------------------------------------
  is_dev    = terraform.workspace == "dev"
  random_id = random_id.this.hex

  # ----------------------------------------------------------------------------------------------
  # Project Informations
  # ----------------------------------------------------------------------------------------------
  project_name    = var.project_name
  project_name_uc = upper(var.project_name)

  # ----------------------------------------------------------------------------------------------
  # Dynamodb Tables
  # ----------------------------------------------------------------------------------------------
  dynamodb_name_event_type   = "${local.project_name_uc}_EventType_${local.random_id}"
  dynamodb_name_notification = "${local.project_name_uc}_Notification_${local.random_id}"
  dynamodb_name_resource     = "${local.project_name_uc}_Resource_${local.random_id}"
  dynamodb_name_unprocessed  = "${local.project_name_uc}_Unprocessed_${local.random_id}"
  dynamodb_name_history      = "${local.project_name_uc}_History_${local.random_id}"
  dynamodb_name_announcement = "${local.project_name_uc}_Announcement_${local.random_id}"
  dynamodb_name_category     = "${local.project_name_uc}_Category_${local.random_id}"

  # ----------------------------------------------------------------------------------------------
  # S3 Bucket
  # ----------------------------------------------------------------------------------------------
  bucket_name_frontend = "${var.project_name}-frontend-${local.random_id}"
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
