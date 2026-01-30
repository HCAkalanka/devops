provider "aws" {
  region = "us-east-1"
}

# 1. Security Group (දොරවල් ටික)
resource "aws_security_group" "app_sg" {
  name        = "devops-project-sg"
  description = "Allow SSH, Frontend, and Backend traffic"

  # SSH (Ansible වලට ඇතුල් වෙන්න)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend Port
  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend Port
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Internet Access (පිටතට යන්න)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Ubuntu AMI එක හොයාගැනීම
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# 2. Frontend Server එක
resource "aws_instance" "frontend" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name      = "devops-project-key" # ඔයාගේ Key නම මෙතනට දාන්න
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  tags = {
    Name = "CarRental-Frontend"
  }
}

# 3. Backend Server එක
resource "aws_instance" "backend" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name      = "devops-project-key" # ඔයාගේ Key නම මෙතනට දාන්න
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  tags = {
    Name = "CarRental-Backend"
  }
}

# 4. IP ලිපිනයන් එළියට ගැනීම
output "frontend_ip" {
  value = aws_instance.frontend.public_ip
}

output "backend_ip" {
  value = aws_instance.backend.public_ip
}