# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Event Type
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "event_type" {
  name         = local.dynamodb_name_event_type
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "EventName"
  range_key    = "EventSource"

  attribute {
    name = "EventName"
    type = "S"
  }

  attribute {
    name = "EventSource"
    type = "S"
  }

  lifecycle {
    prevent_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Resource
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "resource" {
  name             = local.dynamodb_name_resources
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = "ResourceId"
  range_key        = "EventTime"
  stream_enabled   = true
  stream_view_type = "KEYS_ONLY"

  attribute {
    name = "ResourceId"
    type = "S"
  }

  attribute {
    name = "EventTime"
    type = "S"
  }

  attribute {
    name = "EventSource"
    type = "S"
  }

  attribute {
    name = "EventName"
    type = "S"
  }

  attribute {
    name = "ResourceName"
    type = "S"
  }

  global_secondary_index {
    name            = "gsiIdx1"
    hash_key        = "EventSource"
    range_key       = "ResourceName"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "gsiIdx2"
    hash_key        = "EventSource"
    range_key       = "EventName"
    projection_type = "ALL"
  }

  lifecycle {
    prevent_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Events
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "events" {
  name         = local.dynamodb_name_events
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "EventId"

  attribute {
    name = "EventId"
    type = "S"
  }
  attribute {
    name = "EventName"
    type = "S"
  }
  attribute {
    name = "EventSource"
    type = "S"
  }

  global_secondary_index {
    name            = "gsiIdx1"
    hash_key        = "EventSource"
    range_key       = "EventName"
    projection_type = "ALL"
  }

  lifecycle {
    prevent_destroy = false
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Unprocessed
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "unprocessed" {
  name         = local.dynamodb_name_unprocessed
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "EventName"
  range_key    = "EventTime"

  attribute {
    name = "EventName"
    type = "S"
  }
  attribute {
    name = "EventTime"
    type = "S"
  }
  attribute {
    name = "EventSource"
    type = "S"
  }

  global_secondary_index {
    name            = "gsiIdx1"
    hash_key        = "EventSource"
    range_key       = "EventName"
    projection_type = "ALL"
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - User
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "user" {
  name         = local.dynamodb_name_user
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "UserId"

  attribute {
    name = "UserId"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Settings
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "settings" {
  name         = local.dynamodb_name_settings
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "Id"

  attribute {
    name = "Id"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}
