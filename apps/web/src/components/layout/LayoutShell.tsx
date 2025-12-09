import { ReactNode, useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { apiClient } from '../../lib/apiClient';

interface LayoutShellProps {
    children: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
    const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'down'>('checking');

    useEffect(() => {
        apiClient.health()
            .then(() => setApiStatus('ok'))
            .catch(() => setApiStatus('down'));
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 transition-colors">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            EVOSEC
                        </h1>
                        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                            NetSec Monitoring Platform
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`text-xs px-2 py-1 rounded-full border ${apiStatus === 'ok' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : apiStatus === 'down' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' : 'bg-gray-100 text-gray-600'}`}>
                            API: {apiStatus.toUpperCase()}
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-6 mt-auto">
                <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} EVOSEC. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
