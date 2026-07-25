#!/bin/bash
set -e
cd /var/www/bigbestowProject

echo "Starting Docker Compose (v2)..."
docker compose up -d --build

echo "Waiting for DB to initialize..."
sleep 15
echo "Running Migrations..."
docker compose exec -T backend php artisan migrate --force

echo "Setup Complete!"
