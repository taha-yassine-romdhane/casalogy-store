# VPS Docker Setup Guide

This guide helps you deploy your Casalogy store using Docker with your existing PostgreSQL database on the VPS.

## 🚀 Prerequisites

You should already have:
- ✅ PostgreSQL installed and running on VPS
- ✅ Database `casalogy_db` created with user `postgres` and password `admin`
- ✅ Your database imported from local machine
- ✅ Project pulled from GitHub

## 📋 VPS Setup Steps

### 1. Configure PostgreSQL for Docker Access

Allow Docker containers to connect to your PostgreSQL:

```bash
# Find PostgreSQL version and config path
sudo find /etc -name "postgresql.conf" 2>/dev/null

# Edit postgresql.conf (replace XX with your version)
sudo nano /etc/postgresql/XX/main/postgresql.conf
```

Find and update:
```
listen_addresses = 'localhost,172.17.0.1'
```

Edit pg_hba.conf:
```bash
sudo nano /etc/postgresql/XX/main/pg_hba.conf
```

Add this line:
```
host    all             all             172.17.0.0/16           md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### 2. Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Log out and back in, or run:
newgrp docker
```

### 3. Deploy with Docker

```bash
# Navigate to your project
cd ~/casalogy-store

# Build and start services
docker-compose up --build -d

# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Test Your Application

```bash
# Test if app is running
curl http://localhost:3000

# Check Nginx
curl http://localhost:80
```

## 🗄️ Database Connection

The Docker configuration connects to your existing PostgreSQL using:
- **Host**: `host.docker.internal` (Docker's way to access host machine)
- **Database**: `casalogy_db`
- **User**: `postgres`
- **Password**: `admin`
- **Port**: `5432`

## 🌐 Domain Setup

### DNS Configuration
Point your domain to your VPS IP:
```
A Record: casalogystore.com → 54.38.191.45
A Record: www.casalogystore.com → 54.38.191.45
```

### SSL Certificate (Let's Encrypt)
```bash
# Install certbot in nginx container
docker-compose exec nginx apk add certbot certbot-nginx

# Get SSL certificate
docker-compose exec nginx certbot --nginx -d casalogystore.com -d www.casalogystore.com
```

## 🔧 Useful Commands

### Managing Services
```bash
# Stop all services
docker-compose down

# Restart services
docker-compose restart

# View logs for specific service
docker-compose logs app
docker-compose logs nginx

# Update and rebuild
git pull origin main
docker-compose up --build -d
```

### Database Operations
```bash
# Connect to your PostgreSQL from host
psql -h localhost -U postgres -d casalogy_db

# Run Prisma migrations in container
docker-compose exec app npx prisma migrate deploy

# Generate Prisma client
docker-compose exec app npx prisma generate
```

### Backup Your Data
```bash
# Create database backup
pg_dump -h localhost -U postgres -d casalogy_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 🔒 Security Checklist

- [ ] Change default database passwords
- [ ] Update JWT and NextAuth secrets in .env
- [ ] Set up SSL certificates
- [ ] Configure firewall (ports 22, 80, 443)
- [ ] Regular backups
- [ ] Monitor logs: `docker-compose logs -f`

## 🧪 Troubleshooting

### Database Connection Issues
```bash
# Test PostgreSQL connection from container
docker-compose exec app psql -h host.docker.internal -U postgres -d casalogy_db

# Check PostgreSQL is listening on correct interfaces
sudo netstat -tlnp | grep 5432
```

### Container Issues
```bash
# Check container status
docker-compose ps

# Inspect container logs
docker-compose logs app

# Access container shell
docker-compose exec app sh
```

### Nginx Issues
```bash
# Test Nginx configuration
docker-compose exec nginx nginx -t

# Reload Nginx configuration
docker-compose exec nginx nginx -s reload
```

## 📊 Monitoring

Check your application health:
- **Application**: http://your-domain.com
- **Health Check**: http://your-domain.com/health
- **Admin Panel**: http://your-domain.com/admin

Your Casalogy store should now be fully deployed with Docker! 🎉