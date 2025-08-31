#!/bin/bash

# VPS Database Setup Script
echo "🗄️  Setting up PostgreSQL database on VPS..."

# Database configuration (matching your local setup)
DB_NAME="casalogy_db"
DB_USER="postgres"
DB_PASSWORD="admin"

echo "📋 Database Configuration:"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Host: localhost"
echo "   Port: 5432"

# Check if PostgreSQL is installed
echo "🔍 Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found. Installing..."
    
    # Update package list
    sudo apt update
    
    # Install PostgreSQL
    sudo apt install -y postgresql postgresql-contrib
    
    # Start and enable PostgreSQL service
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    echo "✅ PostgreSQL installed and started"
else
    echo "✅ PostgreSQL is already installed"
fi

# Check PostgreSQL status
echo "🔍 Checking PostgreSQL status..."
sudo systemctl status postgresql --no-pager -l

# Set up database and user
echo "🛠️  Setting up database and user..."

# Switch to postgres user and create database
sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';" | grep -q 1 && {
    echo "⚠️  Database '$DB_NAME' already exists"
} || {
    echo "📝 Creating database '$DB_NAME'..."
    sudo -u postgres createdb "$DB_NAME"
    echo "✅ Database '$DB_NAME' created"
}

# Set password for postgres user
echo "🔑 Setting password for postgres user..."
sudo -u postgres psql -c "ALTER USER $DB_USER PASSWORD '$DB_PASSWORD';"

# Update PostgreSQL configuration to allow password authentication
echo "⚙️  Configuring PostgreSQL authentication..."

# Find PostgreSQL version and config path
PG_VERSION=$(sudo -u postgres psql -t -c "SELECT version();" | grep -oP '\d+\.\d+' | head -1)
PG_CONFIG_PATH="/etc/postgresql/$PG_VERSION/main"

if [ -d "$PG_CONFIG_PATH" ]; then
    echo "📁 PostgreSQL config path: $PG_CONFIG_PATH"
    
    # Backup original configs
    sudo cp "$PG_CONFIG_PATH/pg_hba.conf" "$PG_CONFIG_PATH/pg_hba.conf.backup"
    sudo cp "$PG_CONFIG_PATH/postgresql.conf" "$PG_CONFIG_PATH/postgresql.conf.backup"
    
    # Update pg_hba.conf to allow password authentication
    echo "🔧 Updating pg_hba.conf for password authentication..."
    sudo sed -i "s/#local   all             all                                     peer/local   all             all                                     md5/" "$PG_CONFIG_PATH/pg_hba.conf"
    sudo sed -i "s/local   all             all                                     peer/local   all             all                                     md5/" "$PG_CONFIG_PATH/pg_hba.conf"
    
    # Ensure PostgreSQL listens on localhost
    echo "🔧 Updating postgresql.conf to listen on localhost..."
    sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" "$PG_CONFIG_PATH/postgresql.conf"
    
    # Restart PostgreSQL to apply changes
    echo "🔄 Restarting PostgreSQL..."
    sudo systemctl restart postgresql
    
    echo "✅ PostgreSQL configuration updated"
else
    echo "⚠️  Could not find PostgreSQL config directory. Manual configuration may be needed."
fi

# Test database connection
echo "🧪 Testing database connection..."
export PGPASSWORD="$DB_PASSWORD"
psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1 AS test_connection;" &> /dev/null && {
    echo "✅ Database connection successful!"
} || {
    echo "❌ Database connection failed. Please check configuration."
    echo "💡 Try connecting manually with: psql -h localhost -U $DB_USER -d $DB_NAME"
}

# Create .env file template
echo "📝 Creating .env template..."
cat > .env.template << EOF
# Database Configuration
DATABASE_URL="postgres://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"

# Authentication Secrets (CHANGE THESE IN PRODUCTION!)
NEXTAUTH_URL=https://casalogystore.com
NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this-in-production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Upload Directory
UPLOAD_DIR=/var/www/casalogystore/uploads

# Node Environment
NODE_ENV=production
EOF

echo "📄 .env template created! Copy your local .env or update the template:"
echo "   cp .env.template .env"
echo "   # Then edit .env with your actual secrets"

# Display next steps
echo ""
echo "🎉 VPS Database setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Copy your local .env file to this server"
echo "2. Update any production-specific variables in .env"
echo "3. Install Node.js and npm if not already installed"
echo "4. Run: npm install"
echo "5. Run: npx prisma migrate deploy"
echo "6. Run: npm run build"
echo "7. Run: npm start"
echo ""
echo "💡 Database connection string: postgres://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"

unset PGPASSWORD