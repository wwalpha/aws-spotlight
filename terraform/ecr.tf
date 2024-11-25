# ----------------------------------------------------------------------------------------------
# ECR (Lambda) - CloudTrail
# ----------------------------------------------------------------------------------------------
resource "aws_ecr_repository" "cloudtrail" {
  name                 = "${local.project_name}/cloudtrail-${local.environment}"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = false
  }
}

# ----------------------------------------------------------------------------------------------
# Null Resource
# ----------------------------------------------------------------------------------------------
resource "null_resource" "cloudtrail" {
  triggers = {
    file_content_md5 = md5(file("${path.module}/scripts/dockerbuild.sh"))
  }

  provisioner "local-exec" {
    command = "sh ${path.module}/scripts/dockerbuild.sh"

    environment = {
      FOLDER_PATH    = "demo"
      AWS_REGION     = local.region
      AWS_ACCOUNT_ID = local.account_id
      REPO_URL       = aws_ecr_repository.cloudtrail.repository_url
    }
  }
}
