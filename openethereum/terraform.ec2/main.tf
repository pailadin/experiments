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



data "aws_ebs_volume" "ebs_volume" {
  filter {
    name   = "tag:Name"
    values = ["openethereum-ebs-${var.environment}"]
  }
}



data "aws_vpc" "vpc" {
  tags = {
    Name = "openethereum-${var.environment}"
  }
}

data "aws_subnet" "subnet" {
  vpc_id            = data.aws_vpc.vpc.id
  availability_zone = var.availability_zone

  tags = {
    Public = "1"
  }
}

resource "aws_security_group" "security_group" {
  name   = "openethereum-${var.environment}"
  vpc_id = data.aws_vpc.vpc.id

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

resource "aws_volume_attachment" "ebs_att" {
  device_name = "/dev/xvdb"
  volume_id   = data.aws_ebs_volume.ebs_volume.id
  instance_id = aws_instance.instance.id
}

data "template_file" "cloud_init" {
  template = file("cloud_init.yml")
}

resource "aws_instance" "instance" {
  ami                    = data.aws_ami.ami.id
  instance_type          = var.instance_type
  vpc_security_group_ids = [aws_security_group.security_group.id]
  subnet_id              = data.aws_subnet.subnet.id
  key_name               = "rey"

  user_data = data.template_file.cloud_init.rendered

  root_block_device {
    delete_on_termination = true
    volume_type           = "gp3"
    volume_size           = 16
  }

  availability_zone = var.availability_zone

  tags = {
    Name        = "openethereum-${var.environment}"
    Terraform   = "true"
    project     = "hov-experiments"
  }
}

output "instance_ip_addr" {
  value = aws_instance.instance.public_ip
}
