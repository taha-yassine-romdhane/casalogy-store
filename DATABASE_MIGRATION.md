# Database Migration Guide

This guide explains how to export your local database and import it to your VPS for deployment.

## 🏠 Local Development → 🚀 Production Migration

### Step 1: Export Local Database

On your local machine, run:

```bash
# Make script executable
chmod +x scripts/export-db.sh

# Export your local database
./scripts/export-db.sh
```

This will create a backup file in `scripts/backups/` with timestamp, for example:
- `scripts/backups/casalogy_backup_20241201_143052.sql`
- `scripts/backups/latest.sql` (symlink to latest backup)

### Step 2: Transfer Backup to VPS

Upload the backup file to your VPS:

```bash
# Using SCP (replace your-server.com with your actual server)
scp scripts/backups/latest.sql user@your-server.com:/path/to/casalogy-store/scripts/backups/

# Or using rsync
rsync -av scripts/backups/ user@your-server.com:/path/to/casalogy-store/scripts/backups/
```

### Step 3: Deploy on VPS

On your VPS, run:

```bash
# Make scripts executable
chmod +x scripts/*.sh
chmod +x deploy.sh

# Deploy with database import
./deploy.sh
```

## 🛠️ Manual Database Operations

### Manual Import

If you need to import a specific backup file:

```bash
./scripts/import-db.sh scripts/backups/casalogy_backup_20241201_143052.sql
```

### Fresh Database Setup

For a fresh setup without importing data:

```bash
# Start PostgreSQL only
docker-compose up -d postgres

# Wait for it to be ready
sleep 10

# Run migrations
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma generate

# Optional: seed with initial data
docker-compose exec app npm run seed
```

## 📋 Database Information

### Local Database (Development)
- Connection details from your `.env` file
- Usually: `postgresql://username:password@localhost:5432/database_name`

### Production Database (Docker)
- Host: `postgres` container
- Port: `5432`
- User: `casalogy_user`
- Password: `casalogy_secure_password_2024`
- Database: `casalogy_store`

## 🔧 Troubleshooting

### Export Issues
```bash
# Check if PostgreSQL is running locally
pg_isready

# Check your .env file has DATABASE_URL
cat .env | grep DATABASE_URL
```

### Import Issues
```bash
# Check if Docker PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Connect to database manually
docker-compose exec postgres psql -U casalogy_user -d casalogy_store
```

### Permission Issues
```bash
# Make all scripts executable
chmod +x scripts/*.sh
chmod +x deploy.sh
```

## ⚠️ Important Notes

1. **Backup files contain sensitive data** - They are excluded from git
2. **Change default passwords** in production `docker-compose.yml`
3. **Always test imports** on a staging environment first
4. **Keep regular backups** of your production database

## 🔒 Security

- Backup files are automatically excluded from git
- Change default database passwords before production
- Use environment variables for sensitive data
- Consider encrypting backup files for transfer