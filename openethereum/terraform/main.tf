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

resource "aws_ebs_volume" "volume" {
  availability_zone = var.availability_zone
  size              = 512
  type              = "gp3"

  tags = {
    Name = "openethereum-ebs"
    Terraform   = "true"
    project     = "hov-experiments"
  }
}

resource "aws_volume_attachment" "ebs_att" {
  device_name = "/dev/sdh"
  volume_id   = aws_ebs_volume.volume.id
  instance_id = aws_instance.instance.id
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
  key_name               = "rey"

  user_data = data.template_file.cloud_init.rendered

  root_block_device {
    delete_on_termination = true
    volume_type           = "gp3"
    volume_size           = 16
  }

  availability_zone = var.availability_zone

  provisioner "local-exec" {
    command = <<EOF
      aws ec2 wait instance-status-ok --region ${var.region} --instance-ids ${self.id} \
      && ANSIBLE_CONFIG=../ansible/ansible.cfg  ansible-playbook -i '${self.public_ip},' -v ../ansible/main.yml
      EOF
  }

  tags = {
    Name        = "openethereum-ec2"
    Terraform   = "true"
    project     = "hov-experiments"
  }
}

output "instance_ip_addr" {
  value = aws_instance.instance.public_ip
}
