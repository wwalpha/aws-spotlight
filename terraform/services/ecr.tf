# ----------------------------------------------------------------------------------------------
# ECR - Auth Manager
# ----------------------------------------------------------------------------------------------
resource "aws_ecr_repository" "auth" {
  name                 = "${local.project_name}/auth"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

# ----------------------------------------------------------------------------------------------
# ECR - Token Manager
# ----------------------------------------------------------------------------------------------
resource "aws_ecr_repository" "token" {
  name                 = "${local.project_name}/token"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

# ----------------------------------------------------------------------------------------------
# ECR - Token Manager
# ----------------------------------------------------------------------------------------------
resource "aws_ecr_repository" "user" {
  name                 = "${local.project_name}/user"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

# ----------------------------------------------------------------------------------------------
# ECR (Lambda) - CloudTrail
# ----------------------------------------------------------------------------------------------
resource "aws_ecr_repository" "cloudtrail" {
  name                 = "${local.project_name}/cloudtrail"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

# ----------------------------------------------------------------------------------------------
# ECR (Lambda) - Unprocessed
# ----------------------------------------------------------------------------------------------
resource "aws_ecr_repository" "unprocessed" {
  name                 = "${local.project_name}/unprocessed"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

# ----------------------------------------------------------------------------------------------
# ECR (ECS) - Resource Manager 
# ----------------------------------------------------------------------------------------------
resource "aws_ecr_repository" "resource" {
  name                 = "${local.project_name}/resource"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

# ----------------------------------------------------------------------------------------------
# Null Resource
# ----------------------------------------------------------------------------------------------
resource "null_resource" "demo" {
  triggers = {
    file_content_md5 = md5(file("${path.module}/scripts/dockerbuild.sh"))
  }

  provisioner "local-exec" {
    command = "sh ${path.module}/scripts/dockerbuild.sh"

    environment = {
      FOLDER_PATH    = "demo"
      AWS_REGION     = local.region
      AWS_ACCOUNT_ID = local.account_id
      REPO_URL       = aws_ecr_repository.auth.repository_url
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Null Resource
# ----------------------------------------------------------------------------------------------
resource "null_resource" "unprocessed" {
  triggers = {
    file_content_md5 = md5(file("${path.module}/scripts/dockerbuild.sh"))
  }

  provisioner "local-exec" {
    command = "sh ${path.module}/scripts/dockerbuild.sh"

    environment = {
      FOLDER_PATH    = "demo"
      AWS_REGION     = local.region
      AWS_ACCOUNT_ID = local.account_id
      REPO_URL       = aws_ecr_repository.unprocessed.repository_url
    }
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

# ----------------------------------------------------------------------------------------------
# Null Resource
# ----------------------------------------------------------------------------------------------
resource "null_resource" "token" {
  triggers = {
    file_content_md5 = md5(file("${path.module}/scripts/dockerbuild.sh"))
  }

  provisioner "local-exec" {
    command = "sh ${path.module}/scripts/dockerbuild.sh"

    environment = {
      FOLDER_PATH    = "demo"
      AWS_REGION     = local.region
      AWS_ACCOUNT_ID = local.account_id
      REPO_URL       = aws_ecr_repository.token.repository_url
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Null Resource
# ----------------------------------------------------------------------------------------------
resource "null_resource" "user" {
  triggers = {
    file_content_md5 = md5(file("${path.module}/scripts/dockerbuild.sh"))
  }

  provisioner "local-exec" {
    command = "sh ${path.module}/scripts/dockerbuild.sh"

    environment = {
      FOLDER_PATH    = "demo"
      AWS_REGION     = local.region
      AWS_ACCOUNT_ID = local.account_id
      REPO_URL       = aws_ecr_repository.user.repository_url
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Null Resource
# ----------------------------------------------------------------------------------------------
resource "null_resource" "resource" {
  triggers = {
    file_content_md5 = md5(file("${path.module}/scripts/dockerbuild.sh"))
  }

  provisioner "local-exec" {
    command = "sh ${path.module}/scripts/dockerbuild.sh"

    environment = {
      FOLDER_PATH    = "demo"
      AWS_REGION     = local.region
      AWS_ACCOUNT_ID = local.account_id
      REPO_URL       = aws_ecr_repository.resource.repository_url
    }
  }
}
