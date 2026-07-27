<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Page;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aboutHtml = <<<'HTML'
<!-- Hero Section -->
<div class="relative bg-black text-white py-24 lg:py-32 overflow-hidden">
    <div class="absolute inset-0 z-0">
        <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80" 
            alt="Team working" 
            class="w-full h-full object-cover opacity-30"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
    </div>
    
    <div class="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-black mb-6">Redefining Shopping for the Modern World.</h1>
        <p class="text-xl text-gray-300 leading-relaxed">
            At Bigbestow, we believe that premium quality products should be accessible to everyone. We blend cutting-edge design with customer satisfaction to curate collections that inspire.
        </p>
    </div>
</div>

<!-- Stats Section -->
<div class="bg-indigo-600 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-indigo-500">
            <div>
                <div class="text-4xl font-black mb-2">1M+</div>
                <div class="text-indigo-200 font-medium uppercase tracking-wider text-sm">Happy Customers</div>
            </div>
            <div>
                <div class="text-4xl font-black mb-2">50+</div>
                <div class="text-indigo-200 font-medium uppercase tracking-wider text-sm">Cities & Regions</div>
            </div>
            <div>
                <div class="text-4xl font-black mb-2">99%</div>
                <div class="text-indigo-200 font-medium uppercase tracking-wider text-sm">Positive Feedback</div>
            </div>
            <div>
                <div class="text-4xl font-black mb-2">24/7</div>
                <div class="text-indigo-200 font-medium uppercase tracking-wider text-sm">Customer Support</div>
            </div>
        </div>
    </div>
</div>

<!-- Our Values -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
    <div class="text-center mb-16">
        <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-4">Our Core Values</h2>
        <p class="text-gray-500 dark:text-slate-400 max-w-2xl mx-auto">Everything we do is guided by these four principles.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="bg-gray-50 dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <div class="bg-white dark:bg-slate-800 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6">
                <svg class="w-7 h-7 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Uncompromising Quality</h3>
            <p class="text-gray-600 dark:text-slate-400">We source the finest materials and brands to ensure every product stands the test of time.</p>
        </div>

        <div class="bg-gray-50 dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <div class="bg-white dark:bg-slate-800 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6">
                <svg class="w-7 h-7 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Community First</h3>
            <p class="text-gray-600 dark:text-slate-400">We listen to our customers. Your feedback directly shapes our catalog and deals.</p>
        </div>

        <div class="bg-gray-50 dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <div class="bg-white dark:bg-slate-800 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6">
                <svg class="w-7 h-7 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Trust & Reliability</h3>
            <p class="text-gray-600 dark:text-slate-400">We are committed to secure transactions, fast delivery, and honest customer policies.</p>
        </div>

        <div class="bg-gray-50 dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <div class="bg-white dark:bg-slate-800 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6">
                <svg class="w-7 h-7 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Fast Innovation</h3>
            <p class="text-gray-600 dark:text-slate-400">Shopping trends move fast, and so do we. We constantly update our store to match global styles.</p>
        </div>
    </div>
</div>

<!-- Story Section -->
<div class="bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
        <div class="w-full md:w-1/2">
            <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80" 
                alt="Our story" 
                class="rounded-3xl shadow-2xl"
            />
        </div>
        <div class="w-full md:w-1/2 space-y-6">
            <div class="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">Our Story</div>
            <h2 class="text-4xl font-black text-gray-900 dark:text-white">How it all started.</h2>
            <p class="text-lg text-gray-600 dark:text-slate-400 leading-relaxed">
                Founded with a passion for excellence, Bigbestow began with a simple mission: to create the ultimate destination for top-notch lifestyle gear and everyday essentials. Since then, we've grown into a trusted e-commerce leader.
            </p>
            <ul class="space-y-4 mt-6">
                <li class="flex items-center gap-3 text-gray-700 dark:text-slate-300 font-medium">
                    <svg class="w-5 h-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Ethical sourcing from day one.
                </li>
                <li class="flex items-center gap-3 text-gray-700 dark:text-slate-300 font-medium">
                    <svg class="w-5 h-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> 100% Carbon neutral shipping.
                </li>
                <li class="flex items-center gap-3 text-gray-700 dark:text-slate-300 font-medium">
                    <svg class="w-5 h-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Award-winning customer service.
                </li>
            </ul>
        </div>
    </div>
</div>
HTML;

        Page::updateOrCreate(['slug' => 'about'], [
            'title' => 'About Us',
            'content' => $aboutHtml,
            'status' => 1
        ]);

        $terms = <<<'HTML'
<p class="text-sm text-gray-500 dark:text-slate-400 mb-6">Last updated: January 1, 2026</p>
<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">1. Introduction</h3>
<p class="mb-4 text-black dark:text-white">Welcome to Bigbestow. By accessing our website, you agree to these Terms of Service. Please read them carefully.</p>
<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">2. Use of Our Service</h3>
<p class="mb-4 text-black dark:text-white">You may use our service only as permitted by law. We may suspend or stop providing our service to you if you do not comply with our terms or policies.</p>
<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">3. Purchases</h3>
<p class="mb-4 text-black dark:text-white">If you wish to purchase any product made available through the service, you may be asked to supply certain information relevant to your purchase.</p>
HTML;
        Page::updateOrCreate(['slug' => 'terms'], ['title' => 'Terms of Service', 'content' => $terms, 'status' => 1]);

        $privacy = <<<'HTML'
<p class="text-sm text-gray-500 dark:text-slate-400 mb-6">Last updated: January 1, 2026</p>
<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">1. Information We Collect</h3>
<p class="mb-4 text-black dark:text-white">We collect information to provide better services to our users. This includes basic details like your IP address, to more personalized details like which products you browse most often.</p>
<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">2. How We Use Information</h3>
<p class="mb-4 text-black dark:text-white">We use the information we collect to provide, maintain, protect and improve our services, to develop new ones, and to protect Bigbestow and our customers.</p>
<h3 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">3. Information Sharing</h3>
<p class="mb-4 text-black dark:text-white">We do not share personal information with companies, organizations and individuals outside of Bigbestow unless one of the following circumstances applies: with your explicit consent, for legal compliance, or for secure payment fulfillment.</p>
HTML;
        Page::updateOrCreate(['slug' => 'privacy'], ['title' => 'Privacy Policy', 'content' => $privacy, 'status' => 1]);

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
        Page::updateOrCreate(['slug' => 'careers'], ['title' => 'Careers at Bigbestow', 'content' => $careers, 'status' => 1]);
    }
}
