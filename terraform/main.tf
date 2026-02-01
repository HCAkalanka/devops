provider "aws" {
  region = "us-east-1"
}

# 1. Security Group (Firewall Rules)
resource "aws_security_group" "app_sg" {
  name        = "devops-project-sg"
  description = "Allow SSH, Frontend, Backend, and Jenkins traffic"

  # SSH Access (Port 22) - Required for Ansible
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend Access (Port 5173) - For React App
  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend Access (Port 5000) - For Node.js API
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Jenkins Access (Port 8080) - NEW: For Jenkins Dashboard
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound Traffic (Allow all internet access)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Fetch the latest Ubuntu 22.04 AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# 2. Frontend Server Instance
resource "aws_instance" "frontend" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  key_name               = "devops-project-key"
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  tags = {
    Name = "CarRental-Frontend"
  }
}

# 3. Backend Server Instance
resource "aws_instance" "backend" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  key_name               = "devops-project-key"
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  tags = {
    Name = "CarRental-Backend"
  }
}

# 4. Jenkins Server Instance - NEW
resource "aws_instance" "jenkins" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  key_name               = "devops-project-key"
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  tags = {
    Name = "Jenkins-Server"
  }
}

# Output the IP addresses
output "frontend_ip" {
  value = aws_instance.frontend.public_ip
}

output "backend_ip" {
  value = aws_instance.backend.public_ip
}

output "jenkins_ip" {
  value = aws_instance.jenkins.public_ip
}