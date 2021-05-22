# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Event Type
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "event_type" {
  name           = local.dynamodb_name_event_type
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "EventName"
  range_key      = "EventSource"

  attribute {
    name = "EventName"
    type = "S"
  }

  attribute {
    name = "EventSource"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Notification
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "notification" {
  name           = local.dynamodb_name_notification
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "EventName"
  range_key      = "EventTime"

  attribute {
    name = "EventName"
    type = "S"
  }
  attribute {
    name = "EventTime"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Resource
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "resource" {
  name           = local.dynamodb_name_resource
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "EventSource"
  range_key      = "ResourceId"

  attribute {
    name = "EventSource"
    type = "S"
  }
  attribute {
    name = "ResourceId"
    type = "S"
  }
  attribute {
    name = "UserName"
    type = "S"
  }

  global_secondary_index {
    name            = "gsiIdx1"
    hash_key        = "UserName"
    range_key       = "ResourceId"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  lifecycle {
    prevent_destroy = true
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Unprocessed
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "unprocessed" {
  name           = local.dynamodb_name_unprocessed
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "EventName"
  range_key      = "EventTime"

  attribute {
    name = "EventName"
    type = "S"
  }
  attribute {
    name = "EventTime"
    type = "S"
  }
  # attribute {
  #   name = "EventTime"
  #   type = "S"
  # }

  # local_secondary_index {
  #   name            = "lsiIdx1"
  #   range_key       = "EventTime"
  #   projection_type = "ALL"
  # }


  # lifecycle {
  #   prevent_destroy = true
  # }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - History
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "history" {
  name           = local.dynamodb_name_history
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "EventId"

  attribute {
    name = "EventId"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}
