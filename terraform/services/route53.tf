# ------------------------------------------------------------------------------------------------
# AWS Route53 Record - CloudFront Alias Record
# ------------------------------------------------------------------------------------------------
resource "aws_route53_record" "frontend" {
  name    = "console.${local.domain_name}"
  type    = "A"
  zone_id = data.aws_route53_zone.this.id

  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.this.domain_name
    zone_id                = aws_cloudfront_distribution.this.hosted_zone_id
  }
}

# ------------------------------------------------------------------------------------------------
# AWS Route53 Record - API Gateway
# ------------------------------------------------------------------------------------------------
resource "aws_route53_record" "api" {
  name    = "api.${local.domain_name}"
  type    = "A"
  zone_id = data.aws_route53_zone.this.id

  alias {
    name                   = aws_apigatewayv2_domain_name.this.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.this.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}
