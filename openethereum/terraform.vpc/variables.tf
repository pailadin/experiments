variable "region" {
  type = string
}

variable "environment" {
  type = string
}

variable "cidr" {
  type = string
}

variable "azs" {
  type = list(any)
}

variable "public_subnets" {
  type = list(any)
}

variable "private_subnets" {
  type = list(any)
}