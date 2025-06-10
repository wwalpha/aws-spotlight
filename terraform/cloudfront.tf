# ------------------------------------------------------------------------------------------------
# AWS CloudFront Distribution
# ------------------------------------------------------------------------------------------------
resource "aws_cloudfront_distribution" "this" {
  enabled             = true
  default_root_object = local.default_root_object
  http_version        = "http2"

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    smooth_streaming       = false
    target_origin_id       = local.origin_id_frontend
    viewer_protocol_policy = local.viewer_protocol_policy

    grpc_config {
      enabled = false
    }
  }

  origin {
    domain_name              = aws_s3_bucket.material.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.this.id
    origin_id                = local.origin_id_frontend
    origin_path              = "/frontend"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    minimum_protocol_version       = "TLSv1"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

# ------------------------------------------------------------------------------------------------
# CloudFront Origin Access Identity
# ------------------------------------------------------------------------------------------------
resource "aws_cloudfront_origin_access_control" "this" {
  name                              = "${local.project_name}-${local.environment}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ------------------------------------------------------------------------------------------------
# CloudFront Origin Access Identity Policy (WEB)
# ------------------------------------------------------------------------------------------------
resource "aws_s3_bucket_policy" "this" {
  depends_on = [aws_cloudfront_origin_access_control.this]

  bucket = aws_s3_bucket.material.id
  policy = data.aws_iam_policy_document.this.json
}

data "aws_iam_policy_document" "this" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${aws_s3_bucket.material.arn}/frontend/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.this.arn]
    }
  }
}
