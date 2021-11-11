data "aws_ami" "ami" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"]
}

resource "aws_security_group" "security_group" {
  name   = "openethereum-node"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8545
    to_port     = 8546
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "template_file" "cloud_init" {
  template = file("cloud_init.yml")
}

resource "aws_instance" "instance" {
  ami                    = data.aws_ami.ami.id
  instance_type          = var.instance_type
  vpc_security_group_ids = [aws_security_group.security_group.id]
  key_name               = "roger"

  user_data = data.template_file.cloud_init.rendered

  root_block_device {
    delete_on_termination = true
    volume_type           = "gp3"
    volume_size           = 16
  }

  ebs_block_device {
    device_name           = "openethereum-ebs"
    delete_on_termination = true
    volume_type           = "gp3"
    volume_size           = 256

    tags = {
      Terraform   = "true"
      project     = "hov-experiments"
    }
  }

  tags = {
    Name        = "openethereum-ec2"
    Terraform   = "true"
    project     = "hov-experiments"
  }
}
