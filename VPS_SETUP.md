# VPS Setup Guide

This guide helps you set up your Casalogy store on a VPS with a local PostgreSQL database (not Docker).

## 🚀 Quick Setup Commands

On your VPS, run these commands in order:

```bash
# 1. Clone the repository
git clone https://github.com/taha-yassine-romdhane/casalogy-store.git
cd casalogy-store

# 2. Set up PostgreSQL database
chmod +x scripts/setup-vps-db.sh
./scripts/setup-vps-db.sh

# 3. Copy your .env file from local machine
# (See section below for how to transfer)

# 4. Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 5. Install dependencies
npm install

# 6. Generate Prisma client
npx prisma generate

# 7. Run database migrations
npx prisma migrate deploy

# 8. Import your database data (optional)
./scripts/import-db-direct.sh

# 9. Build the application
npm run build

# 10. Start the application
npm start
```

## 📁 Transferring Your .env File

### Method 1: Using SCP (Secure Copy)
```bash
# From your local machine, copy .env to VPS
scp .env username@your-vps-ip:/path/to/casalogy-store/.env

# Example:
scp .env root@casalogystore.com:/root/casalogy-store/.env
```

### Method 2: Manual Copy
```bash
# On your local machine, display the .env content
cat .env

# Copy the output, then on VPS create the file:
nano .env
# Paste the content and save
```

### Method 3: Using rsync
```bash
# From local machine
rsync -av .env username@your-vps-ip:/path/to/casalogy-store/
```

## 🗄️ Database Options

### Option 1: Fresh Database (Recommended for first setup)
```bash
# Just run migrations - creates empty database with structure
npx prisma migrate deploy
npx prisma generate

# Optional: Add initial data
npm run seed
```

### Option 2: Import Your Local Database
```bash
# First, export from local machine (already done):
./scripts/export-db.sh

# Transfer backup file to VPS:
scp scripts/backups/latest.sql username@your-vps:/path/to/casalogy-store/scripts/backups/

# On VPS, import the data:
./scripts/import-db-direct.sh
```

## ⚙️ Environment Variables

Update these in your `.env` file for production:

```env
# Update for your domain
NEXTAUTH_URL=https://casalogystore.com

# Use strong secrets (generate new ones!)
NEXTAUTH_SECRET=your-production-nextauth-secret-here
JWT_SECRET=your-production-jwt-secret-here

# Production upload directory
UPLOAD_DIR=/var/www/casalogystore/uploads

# Production environment
NODE_ENV=production

# Database remains the same as local
DATABASE_URL="postgres://postgres:admin@localhost:5432/casalogy_db"
```

## 🔒 Security Considerations

1. **Change default passwords** in production
2. **Generate new secrets** for JWT and NextAuth
3. **Set up SSL certificates** for HTTPS
4. **Configure firewall** to only allow necessary ports
5. **Regular backups** of database and uploads

## 📊 Process Management (PM2)

For production, use PM2 to manage your Node.js process:

```bash
# Install PM2
sudo npm install -g pm2

# Start your app with PM2
pm2 start npm --name "casalogy-store" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## 🌐 Web Server (Nginx)

Set up Nginx as reverse proxy:

```bash
# Install Nginx
sudo apt install nginx

# Create site configuration
sudo nano /etc/nginx/sites-available/casalogystore.com

# Add configuration (see NGINX_CONFIG.md)

# Enable site
sudo ln -s /etc/nginx/sites-available/casalogystore.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🧪 Testing

After setup, test your application:

```bash
# Check if app is running
curl http://localhost:3000

# Check database connection
npx prisma studio

# View logs
pm2 logs casalogy-store
```

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d casalogy_db

# Check PostgreSQL status
sudo systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/*.log
```

### Application Issues
```bash
# Check application logs
pm2 logs casalogy-store

# Restart application
pm2 restart casalogy-store

# Check if port 3000 is in use
sudo netstat -tlnp | grep 3000
```

### File Permissions
```bash
# Set correct permissions for uploads
sudo mkdir -p /var/www/casalogystore/uploads
sudo chown -R www-data:www-data /var/www/casalogystore/uploads
sudo chmod -R 755 /var/www/casalogystore/uploads
```