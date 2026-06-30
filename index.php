<?php

/**
 * Root index forwarder for shared hosting environments where document root
 * points to the repository root instead of the public/ directory.
 */
if (file_exists(__DIR__.'/public/index.php')) {
    require_once __DIR__.'/public/index.php';
} else {
    echo "Error: public/index.php not found.";
}
