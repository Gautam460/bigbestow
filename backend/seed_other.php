<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// TERMS
$terms = <<<'HTML'
<p class="text-sm text-gray-500 dark:text-slate-400 mb-6">Last updated: January 1, 2026</p>
<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">1. Introduction</h3>
<p class="mb-4 text-black dark:text-white">Welcome to Bigbestow. By accessing our website, you agree to these Terms of Service. Please read them carefully.</p>
<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">2. Use of Our Service</h3>
<p class="mb-4 text-black dark:text-white">You may use our service only as permitted by law. We may suspend or stop providing our service to you if you do not comply with our terms or policies.</p>
<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">3. Purchases</h3>
<p class="mb-4 text-black dark:text-white">If you wish to purchase any product made available through the service, you may be asked to supply certain information relevant to your purchase.</p>
HTML;
\App\Models\Page::updateOrCreate(['slug' => 'terms'], ['title' => 'Terms of Service', 'content' => $terms]);

// PRIVACY
$privacy = <<<'HTML'
<p class="text-sm text-gray-500 dark:text-slate-400 mb-6">Last updated: January 1, 2026</p>
<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">1. Information We Collect</h3>
<p class="mb-4 text-black dark:text-white">We collect information to provide better services to our users. This includes basic details like your IP address, to more personalized details like which products you browse most often.</p>
<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">2. How We Use Information</h3>
<p class="mb-4 text-black dark:text-white">We use the information we collect to provide, maintain, protect and improve our services, to develop new ones, and to protect Bigbestow and our customers.</p>
<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">3. Information Sharing</h3>
<p class="mb-4 text-black dark:text-white">We do not share personal information with companies, organizations and individuals outside of Bigbestow unless one of the following circumstances applies: with your explicit consent, for legal compliance, or for secure payment fulfillment.</p>
HTML;
\App\Models\Page::updateOrCreate(['slug' => 'privacy'], ['title' => 'Privacy Policy', 'content' => $privacy]);

// CAREERS
$careers = <<<'HTML'
<p class="text-lg text-gray-700 mb-6 font-medium">Join our mission to redefine modern shopping and lifestyle experiences.</p>
<h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Open Positions</h3>
<ul class="list-disc pl-6 space-y-3 mb-8 text-black">
    <li class="text-black"><strong class="font-semibold text-indigo-600">Senior Frontend Engineer</strong> (React/Next.js) - Remote</li>
    <li class="text-black"><strong class="font-semibold text-indigo-600">E-Commerce Category Manager</strong> - New Delhi, IN</li>
    <li class="text-black"><strong class="font-semibold text-indigo-600">Customer Experience Specialist</strong> - Remote</li>
</ul>
<p class="text-gray-800 mt-6">Don't see a role that fits? Send your resume to <a href="mailto:careers@bigbestow.com" class="text-indigo-600 font-bold underline hover:text-indigo-800">careers@bigbestow.com</a> and we'll keep you in mind for future opportunities.</p>
HTML;
\App\Models\Page::updateOrCreate(['slug' => 'careers'], ['title' => 'Careers at Bigbestow', 'content' => $careers]);

echo "Other pages seeded successfully.\n";
