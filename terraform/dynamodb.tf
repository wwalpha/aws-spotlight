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
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Resource
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "resource" {
  name         = local.dynamodb_name_resources
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "ResourceId"

  attribute {
    name = "ResourceId"
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
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table Item - Resource
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table_item" "this" {
  table_name = aws_dynamodb_table.resource.name
  hash_key   = aws_dynamodb_table.resource.hash_key

  item = <<ITEM
{
  "ResourceId": {
    "S": "arn:aws:iam::334678299258:role/EC2Role"
  },
  "AWSRegion": {
    "S": "us-east-1"
  },
  "EventId": {
    "S": "99999999-6d19-4696-95f8-97e27ff57bad"
  },
  "EventName": {
    "S": "CreateRole"
  },
  "EventSource": {
    "S": "iam.amazonaws.com"
  },
  "EventTime": {
    "S": "2020-10-12T05:21:23Z"
  },
  "ResourceName": {
    "S": "EC2Role"
  },
  "Service": {
    "S": "IAM"
  },
  "Status": {
    "S": "Created"
  },
  "UserName": {
    "S": "ktou@dxc.com"
  }
}
ITEM
}

# ----------------------------------------------------------------------------------------------
# Dynamodb Table - Unprocessed
# ----------------------------------------------------------------------------------------------
resource "aws_dynamodb_table" "unprocessed" {
  name         = local.dynamodb_name_unprocessed
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "eventName"
  range_key    = "eventTime"

  attribute {
    name = "eventName"
    type = "S"
  }
  attribute {
    name = "eventTime"
    type = "S"
  }
  attribute {
    name = "eventSource"
    type = "S"
  }

  global_secondary_index {
    name            = "gsiIdx1"
    hash_key        = "eventSource"
    range_key       = "eventName"
    projection_type = "ALL"
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
}
