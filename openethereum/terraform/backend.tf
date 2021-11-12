terraform {
  backend "s3" {
    bucket = "openethereum-terraform"
    key    = "ec2.tfstate"
    region = "ap-southeast-1"
  }
}