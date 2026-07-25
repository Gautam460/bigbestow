#!/bin/bash
set -e
echo "Updating packages..."
apt-get update -y
echo "Installing Docker..."
apt-get install -y ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-compose
echo "Cloning Repository..."
mkdir -p /var/www
cd /var/www
if [ -d "bigbestowProject" ]; then
    cd bigbestowProject
    git reset --hard
    git pull origin main
else
    git clone https://github.com/Gautam460/bigbestow.git bigbestowProject
    cd bigbestowProject
fi
echo "Setting up backend/.env..."
cat << 'ENVEOF' > backend/.env
APP_NAME=Bigbestow
APP_ENV=production
APP_KEY=base64:5y7haecX82oSq6hDyXQgAIZH9yG1Hs93cz1Kc4EWkkg=
APP_DEBUG=false
APP_URL=https://bigbestow.com
FRONTEND_URL=https://bigbestow.com

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ecommerce_faisal
DB_USERNAME=root
DB_PASSWORD='Gautam@123#'

SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=.bigbestow.com

SANCTUM_STATEFUL_DOMAINS=bigbestow.com,129.121.125.62
ENVEOF

echo "Starting Docker Compose..."
docker-compose up -d --build

echo "Waiting for DB to initialize..."
sleep 15
echo "Running Migrations..."
docker-compose exec -T backend php artisan migrate --force

echo "Setup Complete!"
