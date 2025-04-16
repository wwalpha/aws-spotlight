variable "athena_database_name" {
  description = "The name of the Athena database"
  type        = string
  default     = "default"
}

variable "athena_table_name" {
  description = "The name of the Athena table"
  type        = string
  default     = "cloudtrail_daily"
}

# ----------------------------------------------------------------------------------------------
# CloudTrail Bucket Name
# ----------------------------------------------------------------------------------------------
variable "cloudtrail_bucket_name" {
  description = "The name of the CloudTrail bucket"
  type        = string
  default     = "logs-cloudtrail-global-334678299258-us-east-1"
}

# ----------------------------------------------------------------------------------------------
# Administrator Email Address
# ----------------------------------------------------------------------------------------------
variable "admin_email" {
  default = "ktou@dxc.com"
}
