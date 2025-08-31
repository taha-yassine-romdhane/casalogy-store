#!/bin/bash

# Direct PostgreSQL Import Script (No Docker)
echo "📥 Importing database directly to PostgreSQL..."

# Check if backup file is provided
BACKUP_FILE=${1:-"scripts/backups/latest.sql"}

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    echo "Usage: $0 [backup_file_path]"
    echo "Example: $0 scripts/backups/casalogy_backup_20241201_120000.sql"
    exit 1
fi

echo "📂 Using backup file: $BACKUP_FILE"

# Database credentials (should match your .env)
DB_NAME="casalogy_db"
DB_USER="postgres"
DB_PASSWORD="admin"
DB_HOST="localhost"
DB_PORT="5432"

echo "🔗 Connecting to database: $DB_NAME@$DB_HOST:$DB_PORT"

# Check if .env exists and read DATABASE_URL if available
if [ -f .env ]; then
    echo "📄 Reading database configuration from .env..."
    export $(cat .env | grep DATABASE_URL | xargs)
    
    if [ ! -z "$DATABASE_URL" ]; then
        # Parse DATABASE_URL
        DB_URL_REGEX="postgres(ql)?://([^:]+):([^@]+)@([^:]+):([0-9]+)/(.+)"
        if [[ $DATABASE_URL =~ $DB_URL_REGEX ]]; then
            DB_USER="${BASH_REMATCH[2]}"
            DB_PASSWORD="${BASH_REMATCH[3]}"
            DB_HOST="${BASH_REMATCH[4]}"
            DB_PORT="${BASH_REMATCH[5]}"
            DB_NAME="${BASH_REMATCH[6]}"
            echo "✅ Using database config from .env"
        fi
    fi
fi

# Test database connection first
export PGPASSWORD="$DB_PASSWORD"
echo "🧪 Testing database connection..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" &> /dev/null

if [ $? -ne 0 ]; then
    echo "❌ Database connection failed!"
    echo "💡 Please check:"
    echo "   - PostgreSQL is running: sudo systemctl status postgresql"
    echo "   - Database exists: psql -h $DB_HOST -U $DB_USER -l"
    echo "   - Credentials are correct in .env file"
    exit 1
fi

echo "✅ Database connection successful!"

# Import database
echo "📤 Importing database from $BACKUP_FILE..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database imported successfully!"
    
    # Run Prisma operations
    if command -v npx &> /dev/null; then
        echo "🔄 Running Prisma migrations..."
        npx prisma migrate deploy
        
        echo "⚙️  Generating Prisma client..."
        npx prisma generate
        
        echo "🎉 Database setup completed successfully!"
    else
        echo "⚠️  npx not found. Please run manually:"
        echo "   npx prisma migrate deploy"
        echo "   npx prisma generate"
    fi
    
    # Show database info
    echo "📊 Database tables:"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\dt"
    
else
    echo "❌ Database import failed!"
    echo "💡 Check the backup file format and database permissions"
    exit 1
fi

unset PGPASSWORD
echo "🎉 Import completed successfully!"