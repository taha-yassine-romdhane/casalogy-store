#!/bin/bash

# Casalogy Store Deployment Script
echo "🚀 Starting Casalogy Store deployment..."

# Stop existing containers
echo "⏹️  Stopping existing containers..."
docker-compose down

# Remove old images (optional - uncomment if you want to force rebuild)
# echo "🗑️  Removing old images..."
# docker image prune -f
# docker rmi casalogy-app:latest 2>/dev/null || true

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec app npx prisma migrate deploy

# Seed database (optional - uncomment if you want to seed)
# echo "🌱 Seeding database..."
# docker-compose exec app npm run seed

# Check service health
echo "🩺 Checking service health..."
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20

echo "✅ Deployment completed!"
echo "🌐 Your application should be available at: https://casalogystore.com"
echo "📊 To monitor logs: docker-compose logs -f"
echo "🛑 To stop services: docker-compose down"