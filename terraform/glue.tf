# # ----------------------------------------------------------------------------------------------
# # AWS Glue Catalog Table - CloudTrail
# # ----------------------------------------------------------------------------------------------
# resource "aws_glue_catalog_table" "cloudtrail" {
#   name          = "cloudtrail_logs_us_east_1_${local.environment}"
#   database_name = "default"
#   table_type    = "EXTERNAL_TABLE"
#   owner         = "hadoop"

#   parameters = {
#     "EXTERNAL"       = "TRUE"
#     "classification" = "cloudtrail"
#   }

#   partition_keys {
#     name = "region"
#     type = "string"
#   }

#   partition_keys {
#     name = "year"
#     type = "string"
#   }

#   partition_keys {
#     name = "month"
#     type = "string"
#   }

#   partition_keys {
#     name = "day"
#     type = "string"
#   }

#   storage_descriptor {
#     location      = "s3://logs-cloudtrail-global-334678299258-us-east-1/cloudtrail-global/AWSLogs/334678299258/CloudTrail"
#     input_format  = "com.amazon.emr.cloudtrail.CloudTrailInputFormat"
#     output_format = "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat"

#     ser_de_info {
#       serialization_library = "org.apache.hive.hcatalog.data.JsonSerDe"

#       parameters = {
#         "serialization.format" = 1
#       }
#     }

#     columns {
#       name = "username"
#       type = "string"
#     }

#     columns {
#       name = "eventtime"
#       type = "string"
#     }

#     columns {
#       name = "eventsource"
#       type = "string"

#     }

#     columns {
#       name = "eventname"
#       type = "string"

#     }

#     columns {
#       name = "awsregion"
#       type = "string"

#     }

#     columns {
#       name = "sourceipaddress"
#       type = "string"

#     }

#     columns {
#       name = "useragent"
#       type = "string"

#     }

#     columns {
#       name = "requestparameters"
#       type = "string"

#     }

#     columns {
#       name = "responseelements"
#       type = "string"

#     }

#     columns {
#       name = "additionaleventdata"
#       type = "string"

#     }

#     columns {
#       name = "requestid"
#       type = "string"

#     }

#     columns {
#       name = "eventid"
#       type = "string"

#     }

#     columns {
#       name = "resources"
#       type = "array<struct<arn:string,accountId:string,type:string>>"
#     }

#     columns {
#       name = "recipientaccountid"
#       type = "string"
#     }

#     columns {
#       name = "serviceeventdetails"
#       type = "string"
#     }

#     columns {
#       name = "sharedeventid"
#       type = "string"
#     }

#     columns {
#       name = "vpcendpointid"
#       type = "string"
#     }
#   }
# }

