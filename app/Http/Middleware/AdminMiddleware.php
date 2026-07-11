<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // चेक करते हैं कि admin गार्ड में लॉगिन यूज़र के पास superadmin या admin रोल है या नहीं
        if (auth('admin')->check() && auth('admin')->user()->hasRole(['superadmin', 'admin', 'Super Admin', 'Admin'])) {
            auth()->shouldUse('admin');

            return $next($request);
        }

        if (! auth('admin')->check()) {
            return redirect()->route('admin.login');
        }

        // अगर कोई सामान्य यूज़र एडमिन पैनल खोलने की कोशिश करे तो उसे होमपेज पर भेज दें
        return redirect('/');
    }
}
