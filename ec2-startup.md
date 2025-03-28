# EC2 Deployment Environment Setup for BizzNest Flow Platform  
**Version:** 1.1 | **Last Updated:** [Date]  

---

## **Introduction**  
This documentation outlines the process of configuring a new EC2 instance environment for the BizzNest Flow Platform, including SSH configuration, dependency installation, and filesystem setup.  

---

## **Prerequisites**  

### Infrastructure Checklist  
Ensure the following components are properly configured in AWS before proceeding:  

| **Component**                | **Description**                                  | **Status** |
|-------------------------------|--------------------------------------------------|------------|
| **Security Key Pair**         | PEM key for SSH authentication                  | ✅ Created |
| **Security Group (SSH)**      | Allows inbound/outbound SSH traffic (Port 22)   | ✅ Created |
| **Security Group (HTTP/S)**   | Allows web traffic (Ports 80/443)               | ✅ Created |
| **EC2 Instance (Dev)**        | Development environment instance                | ✅ Created |
| **EC2 Instance (Prod)**       | Production environment instance                 | ✅ Created |

---

## **Instance Connection**  

### SSH Access Requirements  
1. Instance Public IPv4 Address (Found in AWS EC2 Dashboard)
2. Private SSH Key (.pem file)  

**Connection Command:**  
```bash
ssh -i <path/to/private-key.pem> ubuntu@<public-ipv4-address>
```

**Example:**  
```bash
ssh -i ~/.ssh/bizznest-prod.pem ubuntu@203.0.113.45
```

### **Post-Connection Verification**  
Successful connection will display system information:  
```bash
Welcome to Ubuntu 24.04.2 LTS (GNU/Linux 6.8.0-1024-aws x86_64)
System information as of Thu Mar 27 00:24:05 UTC 2025
System load: 0.0 | Memory usage: 26% | Users logged in: 1
```

---

# BizzNest Flow Platform Deployment Script Guide

## Overview
Accelerate your server setup process by up to 85% using our automated script. For those who prefer manual configuration, instructions are available in the Manual Setup section below.

This automated setup script configures an EC2 instance for the BizzNest Flow Platform, handling environment preparation, security configuration, Docker setup, and repository initialization. The script requires **root privileges** and is designed for Ubuntu-based systems.

---

## Prerequisites
- Ubuntu 22.04 LTS or newer
- Minimum 2GB RAM, 20GB disk space
- Outbound internet access
- GitHub account with repository access

---

## Environment Variables
Set these **before execution** or provide when prompted:

| Variable           | Description                                                                 | Example Value                          |
|--------------------|-----------------------------------------------------------------------------|----------------------------------------|
| `GITHUB_EMAIL`     | Email associated with GitHub account (used for SSH key generation)          | `devops@bizznest.com`                  |
| `MONOREPO_URL`     | SSH URL for main repository                                                 | `git@github.com:bizznest/monorepo.git` |
| `MONOREPO_BRANCH`  | Target branch for deployment                                                | `production`                           |
| `DEPLOY_ENV`       | Deployment environment (`production`/`development`)                         | `production`                           |

**Best Practice:** Export variables before execution:
```bash
export GITHUB_EMAIL="your@email.com"
export MONOREPO_URL="git@github.com:yourorg/yourrepo.git"
export MONOREPO_BRANCH="main"
export DEPLOY_ENV="production"
```

---

## Usage

1. **Create Script** 
[Script Code](#script-code)
* create
* copy paste using nano
```bash
touch setup.sh
nano setup.sh
```

2. **Make Executable**
```bash
chmod +x setup.sh
```

3. **Execute with Privileges**
```bash
sudo ./setup.sh
```

---

## SSH Key Configuration
The script automatically generates and displays an ED25519 SSH key, wait for user to complete instructions before proceding:

1. **Key Location**
   - Private: `/home/ubuntu/.ssh/id_ed25519`
   - Public: `/home/ubuntu/.ssh/id_ed25519.pub`

2. **GitHub Setup**
   1. Copy public key contents:
      ```bash
      cat /home/ubuntu/.ssh/id_ed25519.pub
      ```
   2. Add to GitHub:
      - Navigate to **Settings → SSH and GPG Keys**
      - Click **New SSH Key**
      - Paste contents and save

3. **Verify Connection**
```bash
sudo -u ubuntu ssh -T git@github.com
```

---



## Security Features
1. **SSH Hardening**
   - Accepts environment variables via `ENV_*` wildcard
   - Automatic SSH service restart

2. **Permissions**
   - Dedicated `ubuntu` user with Docker privileges
   - Restricted MySQL mount permissions (750)

3. **Automatic Updates**
   - Enabled unattended security updates
   - Configured in `/etc/apt/apt.conf.d/50unattended-upgrades`

---

## Troubleshooting

**Common Issues**:
- **SSH Connection Failures**:
  ```bash
  tail -n 50 /var/log/auth.log
  ```
- **Missing Environment Variables**:
  ```bash
  printenv | grep -E 'GITHUB_EMAIL|MONOREPO|DEPLOY_ENV'
  ```
- **Docker Permission Errors**:
  ```bash
  sudo usermod -aG docker $USER && newgrp docker
  ```

**Log Locations**:
- Script output: `/var/log/bizznest_setup.log`
- Docker logs: `journalctl -u docker.service`

---

> **Note**: Always review scripts from external sources before execution. This script modifies critical system configurations - recommended for use in controlled environments only.

### Script Code
```sh
#!/bin/bash
set -e

# Environment Variables Configuration
# -----------------------------------
# Required Variables (Set these before execution):
# - GITHUB_EMAIL: The private ssh key associated with GitHub account
# - MONOREPO_URL: Git URL for the monorepo (e.g., git@github.com:org/repo.git)
# - PROXY_REPO_URL: Git URL for the proxy configuration repo
# - DEPLOY_ENV: Deployment environment (production/development)

# Verify root privileges
if [ "$EUID" -ne 0 ]; then
  echo "❗ Please run as root (sudo -i)"
  exit 1
fi

# Validate environment variables with interactive fallback
declare -a required_vars=("GITHUB_EMAIL" "MONOREPO_URL" "MONOREPO_BRANCH" "DEPLOY_ENV")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "\n❗ Missing required environment variable: $var"
    read -rp "Please enter a value for $var: " value
    if [ -z "$value" ]; then
      echo -e "\n❌ Critical error: $var must be set! Exiting..."
      exit 1
    else
      declare -gx "$var=$value"  # Set globally and export
      echo "✅ Set $var=${!var}"
    fi
  fi
done

echo -e "\n🔑 Environment variables validated:"
printf "%-15s %-40s\n" "Variable" "Value"
printf "%-15s %-40s\n" "GITHUB_EMAIL" "${GITHUB_EMAIL}"
printf "%-15s %-40s\n" "MONOREPO_URL" "${MONOREPO_URL:0:40}..."
printf "%-15s %-40s\n" "MONOREPO_BRANCH" "${MONOREPO_BRANCH}"
printf "%-15s %-40s\n" "DEPLOY_ENV" "${DEPLOY_ENV}"

# System Configuration
# --------------------
echo "🛠 Starting EC2 environment setup for BizzNest Flow Platform..."

# SSH Configuration
echo "🔧 Configuring SSH for CI/CD..."
sshd_config="/etc/ssh/sshd_config"
cp "$sshd_config" "$sshd_config.bak"
if ! grep -q "ENV_\*" "$sshd_config"; then
  sed -i '/AcceptEnv/s/$/ ENV_*/' "$sshd_config"
fi
systemctl restart ssh

# GitHub Integration
echo "🔑 Setting up GitHub SSH authentication..."
SSH_KEY_PATH="/home/ubuntu/.ssh/id_ed25519"
if [ ! -f "$SSH_KEY_PATH" ]; then
  sudo -u ubuntu ssh-keygen -t ed25519 -C "$GITHUB_EMAIL" -N "" -f "$SSH_KEY_PATH"
fi

echo "📋 GitHub Public Key:"
cat "${SSH_KEY_PATH}.pub"
echo -e "\nℹ️  Add this key to GitHub: Settings → SSH and GPG Keys → New SSH Key"

read -r -p "Then Press Enter .."

# Docker Installation
echo "🐳 Installing Docker components..."
apt-get remove -y docker.io docker-doc docker-compose podman-docker containerd runc || echo "Packages failed, or docker may no be installed, continiung."
apt-get update
apt-get install -y ca-certificates curl

# Docker Repository Setup
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
| tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Packages
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo apt install docker-compose
sudo usermod -aG docker $USER

# Filesystem Setup
echo "📂 Creating directory structure..."
sudo -u ubuntu mkdir -p /home/ubuntu/{configs,"$DEPLOY_ENV",proxy,mounts/mysql}
touch  /home/ubuntu/configs/docker-compose.yml
touch  /home/ubuntu/configs/.env

# Repository Cloning
echo "📦 Cloning repositories..."
(
  cd "/home/ubuntu/$DEPLOY_ENV"
  sudo -u ubuntu git clone "$MONOREPO_URL"
  repo_dir=$(basename "$MONOREPO_URL" .git)
  cd "$repo_dir"
  sudo -u ubuntu git sparse-checkout init --cone
  sudo -u ubuntu git checkout "$MONOREPO_BRANCH"
  sudo -u ubuntu git sparse-checkout set Backend
)

(
  cd /home/ubuntu/proxy
  sudo -u ubuntu git clone "$MONOREPO_URL"
  repo_dir=$(basename "$MONOREPO_URL" .git)
  cd "$repo_dir"
  sudo -u ubuntu git sparse-checkout init --cone
  sudo -u ubuntu git checkout "$MONOREPO_BRANCH"
  sudo -u ubuntu git sparse-checkout set Proxy
)

# Security Configuration
echo "🔒 Applying security settings..."
usermod -aG docker ubuntu
chown -R ubuntu:docker /home/ubuntu/configs
chmod 750 /home/ubuntu/mounts/mysql

# System Maintenance
echo "🔄 Configuring automatic updates..."
apt-get install -y unattended-upgrades
dpkg-reconfigure -p low -f noninteractive unattended-upgrades

# Validation
echo "✅ Validation checks..."
sudo -u ubuntu docker run hello-world

echo -e "\n🎉 Setup completed successfully!"
```



















# Manual Configuration

## **SSH Configuration**  

### Enabling Environment Variables  
To support CI/CD pipeline operations, configure SSH to accept environment variables:  

1. **Edit SSH Configuration**  
   ```bash
   sudo nano /etc/ssh/sshd_config
   ```

2. **Modify SendEnv Directive**  
   Locate and update:  
   ```conf
   SendEnv LANG LC_* ENV_*
   ```

3. **Restart SSH Service**  
   ```bash
   sudo systemctl restart ssh
   ```

**Important:** Always test SSH connections after configuration changes.  

---

## **GitHub Integration**  

### SSH Key Configuration  
1. **Generate New SSH Key Pair**  
   ```bash
   ssh-keygen -t ed25519 -C "bizznest-ec2-access"
   ```

2. **Add Public Key to GitHub**  
   - Copy public key:  
     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```
   - Add to GitHub: *Settings → SSH and GPG Keys → New SSH Key*  

**Verification:**  
```bash
ssh -T git@github.com
# Successful response: "Hi username! You've successfully authenticated..."
```

---

## **Dependency Management**  

### Docker Installation  
**1. Clean Existing Installations**  
```bash
sudo apt-get purge docker.io docker-doc docker-compose podman-docker containerd runc
```

**2. Configure Docker Repository**  
```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
```

**3. Install Docker Components**  
```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo apt  install docker-compose  # version 1.29.2-6
```

**4. Post-Installation Verification**  
```bash
sudo docker run hello-world
# Expect: "Hello from Docker!" message
```

---

## **Filesystem Architecture**  

### Directory Structure  
```bash
/home/ubuntu/
├── configs/               # Environment configurations
│   ├── .env              # Environment variables
│   └── docker-compose.yml # Container orchestration
├── production/           # Production codebase
│   └── bizzNest-Flow/    # Monorepo with sparse checkout
├── proxy/                # Reverse proxy setup
│   └── bizzNest-Flow/    # Proxy server configurations
└── mounts/               # Persistent data storage
    └── mysql/            # Database volume
```

### Initialization Commands  
```bash
mkdir -p /home/ubuntu/{configs,production,proxy,mounts/mysql}
```

### Monorepo Setup (Sparse Checkout)  
**For Development/Production:**  
```bash
cd /home/ubuntu/production
git clone <monorepo-url>
git sparse-checkout init --cone
git sparse-checkout set Backend
```

---

## **Security Best Practices**  

1. **User Permissions**  
   ```bash
   sudo usermod -aG docker ubuntu  # Add user to docker group
   ```

2. **Directory Permissions**  
   ```bash
   sudo chmod 750 /home/ubuntu/mounts/mysql
   sudo chown -R ubuntu:docker /home/ubuntu/configs
   ```

3. **Automatic Updates**  
   ```bash
   sudo apt-get install unattended-upgrades
   sudo dpkg-reconfigure --priority=low unattended-upgrades
   ```

---

## **Troubleshooting**  

| **Issue**                  | **Resolution**                          |
|----------------------------|-----------------------------------------|
| SSH Connection Refused     | Verify security group inbound rules    |
| Docker Permission Denied   | Execute `newgrp docker` and relogin    |
| Environment Variables Not Passing | Confirm SSH config on both client/server |
| Sparse Checkout Failure    | Ensure git >= 2.25 and cone mode enabled |

---
