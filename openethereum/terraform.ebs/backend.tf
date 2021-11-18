terraform {
  backend "s3" {
    bucket = "openethereum-terraform"
    key    = "ebs.tfstate"
    region = "ap-southeast-1"
  }
}