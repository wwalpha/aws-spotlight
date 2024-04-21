# ----------------------------------------------------------------------------------------------
# AWS Lambda Layer libraries
# ----------------------------------------------------------------------------------------------
resource "null_resource" "libraries" {
  triggers = {
    file_content_md5 = md5(file("${path.module}/libraries/package.json"))
  }

  provisioner "local-exec" {
    command = "sh ${path.module}/libraries/scripts.sh"
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Lambda Layer Version
# ----------------------------------------------------------------------------------------------
resource "aws_lambda_layer_version" "libraries" {
  depends_on = [null_resource.libraries]
  filename   = "${path.module}/libraries/libraries.zip"
  layer_name = "${local.project_name}-libraries"

  compatible_runtimes = ["nodejs20.x"]
}
