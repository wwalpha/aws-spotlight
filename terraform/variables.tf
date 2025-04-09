variable "athena_database_name" {
  description = "The name of the Athena database"
  type        = string
  default     = "default"
}

variable "athena_table_name" {
  description = "The name of the Athena table"
  type        = string
}

# ----------------------------------------------------------------------------------------------
# CloudTrail Bucket Name
# ----------------------------------------------------------------------------------------------
variable "cloudtrail_bucket_name" {
  description = "The name of the CloudTrail bucket"
  type        = string
}

# ----------------------------------------------------------------------------------------------
# Administrator Email Address
# ----------------------------------------------------------------------------------------------
variable "admin_email" {
}
