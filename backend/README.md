# BigBestow E-Commerce Platform (Laravel 11 + React + Inertia)

BigBestow is a modern E-Commerce web application built using **Laravel 11** on the backend and **React 19 + TypeScript + Tailwind CSS** on the frontend, connected seamlessly via **Inertia.js**.

---

## ✅ PHP 8.2 Server Compatibility Adjusted!

Since your GenX hosting server (`om.genxwhosting.com`) runs **PHP 8.2.4**, we have downgraded the requirement from Laravel 13 to **Laravel 11** (`^11.0` and PHP `^8.2`). Now the project is completely compatible with your existing hosting server and Docker setup!

---

## 🐳 Running with Docker (All Services at Once)

We have created complete container files (`Dockerfile`, `docker-compose.yml`, `nginx.conf`, `supervisord.conf`) configured for **PHP 8.2**. 

To start **Laravel (PHP 8.2)**, **React Frontend Build**, **Nginx**, and **MySQL Database** all at the same time:

```bash
# Start all containers in the background
docker-compose up -d

# Check running logs
docker-compose logs -f app
```
The application will automatically start running on: **http://localhost:8000**

---

## 📖 Simple Architecture Guide (Laravel + React via Inertia)

Instead of complex REST APIs and manual `fetch/axios` token handling, this app uses **Inertia.js** to render React pages directly from Laravel routes:

### 1. Backend Route (`routes/web.php`)
When a user visits a URL, Laravel processes the request and sends props directly to the React component:
```php
Route::get('/products', function () {
    return Inertia::render('Products', [
        'category' => 'Men Garments',
        'items' => [/* database items */]
    ]);
})->name('products');
```

### 2. Frontend React Page (`resources/js/pages/Products.tsx`)
React automatically receives these props from Laravel seamlessly:
```tsx
import React from 'react';
import { Head } from '@inertiajs/react';

export default function Products({ category, items }) {
    return (
        <div className="container mx-auto p-6">
            <Head title="Our Products" />
            <h1 className="text-3xl font-bold">{category}</h1>
            {/* Render products */}
        </div>
    );
}
```

---

## 🚀 Push to GitHub Repository

Run these exact commands in your terminal to initialize and push all files (including the Docker setup) to your GitHub repository:

```bash
# Initialize git (if not already initialized)
git init

# Add all project files and docker setup
git add .

# Commit your changes
git commit -m "Add complete Docker setup (PHP 8.2 + Nginx + MySQL) for Laravel 11 & React"

# Set main branch
git branch -M main

# Add your remote GitHub repository
git remote add origin https://github.com/Gautam460/bigbestow.git

# Push everything to GitHub
git push -u origin main
*(Note: If `origin` already exists, run `git remote set-url origin https://github.com/Gautam460/bigbestow.git` before pushing).*

---

## 🌐 How to Deploy on cPanel Shared Hosting (No Server Terminal Access)

If your hosting (`om.genxwhosting.com`) only gives you **cPanel File Manager / FTP** without a terminal, follow these exact 4 steps from your **local computer**:

### Step 1: Build Packages & Frontend Locally
Open terminal on your **local computer** inside this project folder and run:
```bash
# 1. Download production PHP dependencies locally
composer install --optimize-autoloader --no-dev

# 2. Build React + Tailwind CSS assets locally
npm install
npm run build
```

### Step 2: Create a ZIP File for Upload
Create a ZIP archive of your project folder.
- **MUST INCLUDE:** `vendor/` folder and `public/build/` folder.
- **DO NOT INCLUDE:** `node_modules/` folder or `.git/` folder (to save upload size).

### Step 3: Upload to cPanel File Manager
1. Log into cPanel ➔ **File Manager**.
2. Upload and extract your ZIP file outside `public_html` (for example: `/home/username/bigbestow/`).
3. Copy all contents of the `/home/username/bigbestow/public/` folder (`index.php`, `build/`, `.htaccess`, etc.) directly into your domain's `public_html/` folder.
4. Edit `public_html/index.php` so it points to your project path:
   ```php
   // Change these two lines:
   require __DIR__.'/../bigbestow/vendor/autoload.php';
   $app = require_once __DIR__.'/../bigbestow/bootstrap/app.php';
   ```

### Step 4: Run Migrations Without Terminal
Since you don't have terminal access on the server, add a temporary web route in `routes/web.php` to run artisan commands via browser:
```php
Route::get('/run-server-setup', function () {
    \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    \Illuminate\Support\Facades\Artisan::call('optimize:clear');
    return 'Database migrated and cache cleared successfully!';
});
```
Visit `https://yourdomain.com/run-server-setup` in your browser once. Your database tables will be created instantly! After running it once, remove or comment out that route.

