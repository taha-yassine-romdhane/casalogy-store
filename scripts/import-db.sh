#!/bin/bash

# Database Import Script for VPS Deployment
echo "📥 Importing database to production..."

# Check if backup file is provided
BACKUP_FILE=${1:-"scripts/backups/latest.sql"}

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    echo "Usage: $0 [backup_file_path]"
    echo "Example: $0 scripts/backups/casalogy_backup_20241201_120000.sql"
    exit 1
fi

echo "📂 Using backup file: $BACKUP_FILE"

# Production database credentials (from docker-compose.yml)
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="casalogy_user"
DB_PASSWORD="casalogy_secure_password_2024"
DB_NAME="casalogy_store"

echo "🔗 Connecting to production database: $DB_NAME@$DB_HOST:$DB_PORT"

# Check if Docker services are running
if ! docker-compose ps | grep -q "postgres"; then
    echo "🚀 Starting Docker services first..."
    docker-compose up -d postgres
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 10
fi

# Import database using docker-compose exec
echo "📤 Importing database..."
docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database imported successfully!"
    
    # Run Prisma migrations to ensure schema is up to date
    echo "🔄 Running Prisma migrations..."
    docker-compose exec app npx prisma migrate deploy
    
    # Generate Prisma client
    echo "⚙️  Generating Prisma client..."
    docker-compose exec app npx prisma generate
    
    echo "🎉 Database setup completed successfully!"
    echo "📊 Database status:"
    docker-compose exec postgres psql -U "$DB_USER" -d "$DB_NAME" -c "\dt"
    
else
    echo "❌ Database import failed!"
    exit 1
fi