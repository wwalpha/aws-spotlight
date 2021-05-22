# ----------------------------------------------------------------------------------------------
# AWS Provider
# ----------------------------------------------------------------------------------------------
provider "aws" {
  region = var.region
}

# ----------------------------------------------------------------------------------------------
# Terraform Settings
# ----------------------------------------------------------------------------------------------
terraform {
  backend "s3" {
    region = "ap-northeast-1"
    bucket = "terraform-state-20210515"
    key    = "ams/backend.tfstate"
  }
}

# ----------------------------------------------------------------------------------------------
# Remote state - Setup
# ----------------------------------------------------------------------------------------------
data "terraform_remote_state" "setup" {
  backend   = "s3"
  workspace = terraform.workspace

  config = {
    region = "ap-northeast-1"
    bucket = "terraform-state-20210515"
    key    = "ams/setup.tfstate"
  }
}

# ----------------------------------------------------------------------------------------------
# Remote state - Services
# ----------------------------------------------------------------------------------------------
data "terraform_remote_state" "services" {
  backend   = "s3"
  workspace = terraform.workspace

  config = {
    region = "ap-northeast-1"
    bucket = "terraform-state-20210515"
    key    = "ams/services.tfstate"
  }
}
