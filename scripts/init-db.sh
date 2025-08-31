#!/bin/bash

# Database Initialization Script for Docker
echo "🗄️  Initializing production database..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec postgres pg_isready -U casalogy_user -d casalogy_store; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Check if we have a backup to restore
BACKUP_FILE="scripts/backups/latest.sql"
if [ -f "$BACKUP_FILE" ]; then
    echo "📤 Found backup file, importing data..."
    ./scripts/import-db.sh "$BACKUP_FILE"
else
    echo "📋 No backup file found, initializing with migrations only..."
    
    # Run Prisma migrations
    echo "🔄 Running Prisma migrations..."
    docker-compose exec app npx prisma migrate deploy
    
    # Generate Prisma client
    echo "⚙️  Generating Prisma client..."
    docker-compose exec app npx prisma generate
    
    # Optional: Run seed script
    if [ -f "prisma/seed.ts" ]; then
        echo "🌱 Running database seed..."
        docker-compose exec app npm run seed
    fi
fi

echo "🎉 Database initialization completed!"