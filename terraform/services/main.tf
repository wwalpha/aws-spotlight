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
    region = "us-east-1"
    bucket = "terraform-state-202106"
    key    = "arms/services.tfstate"
  }
}

# ----------------------------------------------------------------------------------------------
# Remote state - Setup
# ----------------------------------------------------------------------------------------------
data "terraform_remote_state" "setup" {
  backend = "s3"

  config = {
    region = "us-east-1"
    bucket = "terraform-state-202106"
    key    = "arms/setup.tfstate"
  }
}
