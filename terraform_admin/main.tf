# ----------------------------------------------------------------------------------------------
# AWS Provider
# ----------------------------------------------------------------------------------------------
provider "aws" {
  region = "ap-northeast-1"
}

# ----------------------------------------------------------------------------------------------
# Terraform Settings
# ----------------------------------------------------------------------------------------------
terraform {
  backend "s3" {
    region = "us-east-1"
    bucket = "arms-terraform-0606"
    key    = "cleanup/main.tfstate"
  }
}
