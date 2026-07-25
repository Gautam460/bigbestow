'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

export default function ThemeToggle({ className = '' }) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className={`w-9 h-9 p-2 rounded-full ${className}`} />
        );
    }
    
    const isDark = resolvedAppearance === 'dark';

    const toggleTheme = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className={`relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none ${className}`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Dark Mode"
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                <Sun 
                    className={`absolute inset-0 w-full h-full text-amber-500 transition-all duration-500 transform ${
                        isDark ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'
                    }`}
                />
                <Moon 
                    className={`absolute inset-0 w-full h-full text-indigo-400 transition-all duration-500 transform ${
                        isDark ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'
                    }`}
                />
            </div>
        </button>
    );
}
