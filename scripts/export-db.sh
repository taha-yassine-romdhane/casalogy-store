#!/bin/bash

# Database Export Script for Casalogy Store
echo "📤 Exporting local database..."

# Create scripts directory if it doesn't exist
mkdir -p scripts/backups

# Get current timestamp for filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="scripts/backups/casalogy_backup_${TIMESTAMP}.sql"

# Read database URL from .env file
if [ -f .env ]; then
    export $(cat .env | grep DATABASE_URL | xargs)
else
    echo "❌ Error: .env file not found!"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL not found in .env file!"
    exit 1
fi

# Extract database connection details from DATABASE_URL
# Format: postgresql://username:password@localhost:port/database OR postgres://username:password@localhost:port/database
DB_URL_REGEX="postgres(ql)?://([^:]+):([^@]+)@([^:]+):([0-9]+)/(.+)"

if [[ $DATABASE_URL =~ $DB_URL_REGEX ]]; then
    DB_USER="${BASH_REMATCH[2]}"
    DB_PASSWORD="${BASH_REMATCH[3]}"
    DB_HOST="${BASH_REMATCH[4]}"
    DB_PORT="${BASH_REMATCH[5]}"
    DB_NAME="${BASH_REMATCH[6]}"
else
    echo "❌ Error: Could not parse DATABASE_URL"
    exit 1
fi

echo "🔗 Connecting to database: $DB_NAME@$DB_HOST:$DB_PORT"

# Export database with structure and data
export PGPASSWORD="$DB_PASSWORD"

pg_dump \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USER" \
    --dbname="$DB_NAME" \
    --verbose \
    --clean \
    --no-owner \
    --no-privileges \
    --format=plain \
    --file="$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database exported successfully to: $BACKUP_FILE"
    echo "📊 File size: $(du -h $BACKUP_FILE | cut -f1)"
    
    # Also create a latest backup symlink
    ln -sf "casalogy_backup_${TIMESTAMP}.sql" "scripts/backups/latest.sql"
    echo "🔗 Latest backup link created: scripts/backups/latest.sql"
    
    # Show backup info
    echo "📋 Backup contains:"
    grep -c "CREATE TABLE" "$BACKUP_FILE" | xargs echo "   Tables:"
    grep -c "INSERT INTO" "$BACKUP_FILE" | xargs echo "   Data rows:"
    
else
    echo "❌ Database export failed!"
    exit 1
fi

unset PGPASSWORD
echo "🎉 Export completed successfully!"