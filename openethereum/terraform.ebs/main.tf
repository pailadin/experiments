resource "aws_ebs_volume" "volume" {
  availability_zone = var.availability_zone
  size              = var.size
  type              = "gp3"

  tags = {
    Name = "openethereum-ebs-${var.environment}"
    Terraform   = "true"
    project     = "hov-experiments"
  }
}

