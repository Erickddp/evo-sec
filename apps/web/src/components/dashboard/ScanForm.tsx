import { useState } from 'react';
import type { ScanProfile } from '@evosec/shared';
import { Play } from 'lucide-react';

interface ScanFormProps {
    onRunScan: (params: { target: string; profile: ScanProfile }) => void;
    isScanning: boolean;
}

export function ScanForm({ onRunScan, isScanning }: ScanFormProps) {
    const [target, setTarget] = useState('');
    const [profile, setProfile] = useState<ScanProfile>('quick');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!target) return;
        onRunScan({ target, profile });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Start New Scan</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="target" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Target Host or Network
                    </label>
                    <input
                        type="text"
                        id="target"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        disabled={isScanning}
                        placeholder="e.g. 192.168.1.1 or 192.168.1.0/24"
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Allowed: Private networks (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
                    </p>
                </div>

                <div>
                    <label htmlFor="profile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Scan Profile
                    </label>
                    <select
                        id="profile"
                        value={profile}
                        onChange={(e) => setProfile(e.target.value as ScanProfile)}
                        disabled={isScanning}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    >
                        <option value="quick">Quick Scan (Fast – Top Ports)</option>
                        <option value="full">Full Scan (All Ports)</option>
                        <option value="deep">Deep Scan (Ports + Version + OS)</option>
                        <option value="aggressive">Aggressive Intelligence (Nmap -A)</option>
                        <option value="safe">Safe Scripts Scan (NSE Safe)</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {profile === 'quick' && "Fastest scan, checks top 100 common ports."}
                        {profile === 'full' && "Scans all 65535 TCP ports. Takes longer."}
                        {profile === 'deep' && "Detects OS and service versions. Slower but detailed."}
                        {profile === 'aggressive' && "Intense scan: OS, versions, scripts, and traceroute."}
                        {profile === 'safe' && "Uses safe NSE scripts to detect vulnerabilities without crashing services."}
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isScanning || !target}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    {isScanning ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Scanning...
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4" />
                            Start Scan
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
