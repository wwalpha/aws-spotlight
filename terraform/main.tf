# ----------------------------------------------------------------------------------------------
# AWS Provider
# ----------------------------------------------------------------------------------------------
provider "aws" {
  region = "us-east-1"
}

provider "awscc" {
  region = "us-east-1"
}

# ----------------------------------------------------------------------------------------------
# Terraform Settings
# ----------------------------------------------------------------------------------------------
terraform {
  backend "s3" {
    region = "us-east-1"
    bucket = "arms-terraform-0606"
    key    = "spotlight/main.tfstate"
  }

  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
    awscc = {
      source  = "hashicorp/awscc"
      version = "~> 1.44.0"
    }
  }
}
