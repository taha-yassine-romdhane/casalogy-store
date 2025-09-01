#!/bin/bash

# Fix permissions for uploads directory in production
echo "Fixing uploads directory permissions..."

# Create uploads directory if it doesn't exist
mkdir -p public/uploads

# Set proper permissions (read/write for owner and group, read for others)
chmod -R 755 public/uploads

# If running in Docker, ensure the nextjs user can write
if [ -f /.dockerenv ]; then
    echo "Running in Docker container..."
    chown -R 1001:1001 public/uploads
else
    echo "Running on host..."
    # On host, just ensure current user owns the files
    chown -R $(whoami):$(whoami) public/uploads
fi

echo "Permissions fixed successfully!"
echo "Uploads directory permissions:"
ls -la public/uploads/