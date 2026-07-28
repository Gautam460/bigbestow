<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$faq = <<<'HTML'
<div class="text-center mb-12">
    <svg class="w-12 h-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    <h1 class="text-4xl font-black text-gray-900 dark:text-white">Frequently Asked Questions</h1>
</div>
<div class="space-y-4">
    <div class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 flex justify-between items-center">What is your return policy?</h3>
        <p class="text-gray-600 dark:text-slate-400">You can return any unworn, unwashed, or defective merchandise within 30 days of the order delivery date for a full refund.</p>
    </div>
    <div class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 flex justify-between items-center">Do you ship internationally?</h3>
        <p class="text-gray-600 dark:text-slate-400">Yes, we ship to over 50 countries worldwide. Shipping costs will apply, and will be added at checkout.</p>
    </div>
    <div class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 flex justify-between items-center">How long will it take to get my order?</h3>
        <p class="text-gray-600 dark:text-slate-400">It depends on where you are. Orders processed here will take 5-7 business days to arrive. Overseas deliveries can take anywhere from 7-16 days.</p>
    </div>
    <div class="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 flex justify-between items-center">Can I cancel my order?</h3>
        <p class="text-gray-600 dark:text-slate-400">Yes, if your order hasn't been shipped yet, please contact our customer service team immediately to cancel or modify your order.</p>
    </div>
</div>
HTML;
\App\Models\Page::updateOrCreate(['slug' => 'faq'], ['title' => 'FAQ', 'content' => $faq, 'status' => 1]);

$returns = <<<'HTML'
<div class="text-center mb-12">
    <svg class="w-12 h-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
    <h1 class="text-4xl font-black text-gray-900">Returns & Exchanges</h1>
</div>
<div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 prose prose-indigo max-w-none">
    <h3>30-Day Return Policy</h3>
    <p>We want you to love what you ordered. If you're not completely satisfied, you can return most items within 30 days of receipt for a refund or exchange.</p>
    
    <h3>How to Return an Item</h3>
    <ol class="space-y-2 mt-4 text-gray-600">
        <li>Log into your account and navigate to Order History.</li>
        <li>Select the item(s) you wish to return and state the reason.</li>
        <li>Print the prepaid return shipping label.</li>
        <li>Pack your items securely and attach the label.</li>
        <li>Drop off the package at any authorized shipping center.</li>
    </ol>
</div>
HTML;
\App\Models\Page::updateOrCreate(['slug' => 'returns'], ['title' => 'Returns & Exchanges', 'content' => $returns, 'status' => 1]);

$shipping = <<<'HTML'
<h3>Standard Shipping</h3>
<p>We offer free standard shipping on all orders over ₹5,000. For orders under ₹5,000, a flat rate of ₹250 applies. Standard shipping takes 5-7 business days.</p>
<h3>Express Shipping</h3>
<p>Need it faster? Select Express Shipping at checkout for ₹500. Your order will arrive in 2-3 business days.</p>
<h3>International Shipping</h3>
<p>We ship to over 50 countries globally. International shipping rates are calculated at checkout based on destination and package weight.</p>
HTML;
\App\Models\Page::updateOrCreate(['slug' => 'shipping'], ['title' => 'Shipping Information', 'content' => $shipping, 'status' => 1]);

$stores = <<<'HTML'
<p>Visit us in person to try on our latest collections.</p>
<h3>New Delhi Flagship</h3>
<p>Today Sports<br />House No. 1053, Madina Colony, Char Khamba Ke Pas, Meerut, UP 250002<br />Mon-Sat: 10AM - 8PM</p>
HTML;
\App\Models\Page::updateOrCreate(['slug' => 'stores'], ['title' => 'Store Locator', 'content' => $stores, 'status' => 1]);

$track = <<<'HTML'
<h1 class="text-4xl font-black text-gray-900 mb-6">Track Your Order</h1>
<p class="text-gray-600 mb-8">Enter your order number and email address below to see the current status of your shipment.</p>
HTML;
\App\Models\Page::updateOrCreate(['slug' => 'track'], ['title' => 'Track Order', 'content' => $track, 'status' => 1]);

echo "Additional pages seeded successfully.\n";
