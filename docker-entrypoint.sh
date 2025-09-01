#!/bin/sh
set -e

# Ensure uploads directory exists with proper permissions
if [ ! -d "/app/public/uploads" ]; then
    mkdir -p /app/public/uploads
fi

# Fix permissions for uploads directory
# This is run as root before switching to nextjs user
chown -R nextjs:nodejs /app/public/uploads
chmod -R 755 /app/public/uploads

# Execute the main command
exec "$@"