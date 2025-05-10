# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Resource
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "extend" {
  name         = local.dynamodb_name_extend
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "ResourceId"

  attribute {
    name = "ResourceId"
    type = "S"
  }

  ttl {
    enabled        = true
    attribute_name = "expiresAt"
  }
}
