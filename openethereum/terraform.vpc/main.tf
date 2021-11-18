module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 3.2.0"

  name = "openethereum-${var.environment}"
  cidr = var.cidr

  azs             = var.azs
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets

  enable_nat_gateway   = false
  enable_dns_hostnames = true
  enable_dns_support   = true

  public_subnet_tags = {
    Public = "1"
  }

  private_subnet_tags = {
    Private = "1"
  }

  tags = {
    Terraform   = "true"
    Project     = "hov-experiments" 
    Environment = var.environment
  }
}