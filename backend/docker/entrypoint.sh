#!/bin/sh
set -e

# Copy .env if not exists
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# Ensure vendor directory exists (in case volume mount overwrote it during dev)
if [ ! -f vendor/autoload.php ]; then
    echo "Installing Composer dependencies..."
    composer install --no-dev --optimize-autoloader
fi

# Ensure storage directories exist and have proper permissions
mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache/data bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Generate app key if not set
if ! grep -q "^APP_KEY=base64:" .env && ! grep -q "^APP_KEY=.*[a-zA-Z0-9]" .env; then
    echo "Generating application key..."
    php artisan key:generate --force
fi

# Create SQLite DB if configured for SQLite
if grep -q "^DB_CONNECTION=sqlite" .env; then
    touch database/database.sqlite
    chown -R www-data:www-data database
fi

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
