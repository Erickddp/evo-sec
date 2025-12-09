import type { NetworkScanResult } from '@evosec/shared';
import { Server, Activity, ShieldCheck, Clock } from 'lucide-react';

interface NetworkSummaryStripProps {
    scanResult: NetworkScanResult | null;
}

export function NetworkSummaryStrip({ scanResult }: NetworkSummaryStripProps) {
    const stats = [
        {
            label: 'Total Hosts',
            value: scanResult?.summary.totalHosts ?? '-',
            icon: Server,
            color: 'text-blue-600 dark:text-blue-400',
        },
        {
            label: 'Hosts Up',
            value: scanResult?.summary.hostsUp ?? '-',
            icon: Activity,
            color: 'text-green-600 dark:text-green-400',
        },
        {
            label: 'Open Ports',
            value: scanResult?.summary.totalOpenPorts ?? '-',
            icon: ShieldCheck,
            color: 'text-red-600 dark:text-red-400',
        },
        {
            label: 'Duration',
            value: scanResult?.durationMs ? `${(scanResult.durationMs / 1000).toFixed(2)}s` : '-',
            icon: Clock,
            color: 'text-purple-600 dark:text-purple-400',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                        <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
