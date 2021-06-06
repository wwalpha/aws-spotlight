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
    bucket = "terraform-state-202106"
    key    = "arms/backend.tfstate"
  }
}

# ----------------------------------------------------------------------------------------------
# Remote state - Setup
# ----------------------------------------------------------------------------------------------
data "terraform_remote_state" "setup" {
  backend = "s3"

  config = {
    region = "ap-northeast-1"
    bucket = "terraform-state-202106"
    key    = "arms/setup.tfstate"
  }
}

# ----------------------------------------------------------------------------------------------
# Remote state - Services
# ----------------------------------------------------------------------------------------------
data "terraform_remote_state" "services" {
  backend = "s3"

  config = {
    region = "ap-northeast-1"
    bucket = "terraform-state-202106"
    key    = "arms/services.tfstate"
  }
}
