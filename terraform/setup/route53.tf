# ----------------------------------------------------------------------------------------------
# Project Name
# ----------------------------------------------------------------------------------------------
resource "aws_route53_zone" "arms" {
  name = "arms.${var.domain_name}"
}