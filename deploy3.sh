#!/bin/bash
set -e

echo "Setting up /var/www/html..."
mkdir -p /var/www/html
cd /var/www/html

# Clean the directory completely
rm -rf /var/www/html/* /var/www/html/.[!.]* /var/www/html/..?*

echo "Cloning repository..."
git clone https://github.com/Gautam460/bigbestow.git .

echo "Starting Docker Compose (v2)..."
docker compose up -d --build

echo "Waiting for DB to initialize..."
sleep 15
echo "Running Migrations..."
docker compose exec -T backend php artisan migrate --force

echo "Setup Complete!"
