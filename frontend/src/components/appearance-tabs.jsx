import { Monitor, Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({ className = '', ...props }) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    return (
        <div
            className={cn(
                'inline-flex gap-1.5 rounded-xl bg-gray-100 p-1.5 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 transition-colors',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex items-center rounded-lg px-4 py-2 transition-all duration-200 cursor-pointer font-bold',
                        appearance === value
                            ? 'bg-white text-slate-900 shadow-md dark:bg-indigo-600 dark:text-white'
                            : 'text-gray-600 font-semibold hover:bg-gray-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/70 dark:hover:text-white',
                    )}
                >
                    <Icon className="-ml-1 h-4 w-4 shrink-0" />
                    <span className="ml-2 text-sm">{label}</span>
                </button>
            ))}
        </div>
    );
}
