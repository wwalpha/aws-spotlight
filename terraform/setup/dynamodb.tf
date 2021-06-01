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
    range_key       = "EventSource"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
  }

  # lifecycle {
  #   prevent_destroy = true
  # }
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

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Announcement
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "announcement" {
  name           = local.dynamodb_name_announcement
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "Category"
  range_key      = "DateTIme"

  attribute {
    name = "Category"
    type = "S"
  }

  attribute {
    name = "DateTIme"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Category
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "category" {
  name           = local.dynamodb_name_category
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "UserName"
  range_key      = "Category"

  attribute {
    name = "UserName"
    type = "S"
  }

  attribute {
    name = "Category"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}


# ----------------------------------------------------------------------------------------------
# Dynamodb Table - User
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "user" {
  name           = local.dynamodb_name_user
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "UserId"

  attribute {
    name = "UserId"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}
