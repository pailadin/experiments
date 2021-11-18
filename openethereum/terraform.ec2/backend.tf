terraform {
  backend "s3" {
    bucket = "openethereum-terraform"
    key    = "openethereum-ec2.tfstate"
    region = "ap-southeast-1"
  }
}