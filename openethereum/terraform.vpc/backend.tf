terraform {
  backend "s3" {
    bucket = "openethereum-terraform"
    key    = "vpc.tfstate"
    region = "ap-southeast-1"
  }
}