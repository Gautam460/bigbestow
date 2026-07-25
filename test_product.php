<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,"http://localhost:3000/api/admin/products");
curl_setopt($ch, CURLOPT_POST, 1);
$payload = [
    'name' => 'Test Product',
    'category_id' => '1',
    'price' => '100',
    'stock' => '10'
];
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$headers = [
    'Accept: application/json'
];
// We need auth token. Let's just create a test token or bypass auth.
