<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Polyfill for request_parse_body() introduced in PHP 8.4
// Required by symfony/http-foundation 7.2+ on PHP 8.3
if (!function_exists('request_parse_body')) {
    function request_parse_body(): array {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        // Strip parameters like charset/boundary
        if (($pos = strpos($contentType, ';')) !== false) {
            $contentType = substr($contentType, 0, $pos);
        }
        $contentType = strtolower(trim($contentType));

        if ($contentType === 'application/x-www-form-urlencoded') {
            return [$_POST, []];
        }

        if (str_starts_with($contentType, 'multipart/form-data')) {
            return [$_POST, $_FILES];
        }

        return [[], []];
    }
}

// 🛠️ TEMPORARY ERROR REPORTING FOR DEBUGGING 500 ERROR ON SERVER
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
