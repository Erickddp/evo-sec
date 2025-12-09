import type { HostInfo } from '@evosec/shared';
import { X, Server, Network } from 'lucide-react';

interface HostDetailDrawerProps {
    host: HostInfo | null;
    onClose: () => void;
}

export function HostDetailDrawer({ host, onClose }: HostDetailDrawerProps) {
    if (!host) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <Server className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{host.ip}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{host.hostname || 'No hostname resolved'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Host Info</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                <span className="text-xs text-gray-500">Status</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${host.status === 'up' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="font-medium text-gray-900 dark:text-white capitalize">{host.status}</span>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                <span className="text-xs text-gray-500">Total Ports</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <Network className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium text-gray-900 dark:text-white">{host.ports.length} detected</span>
                                </div>
                            </div>
                            {host.osName && (
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 col-span-2">
                                    <span className="text-xs text-gray-500">Operating System</span>
                                    <div className="flex flex-col mt-1">
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {host.osName}
                                            {host.osAccuracy ? ` (${host.osAccuracy}%)` : ''}
                                        </span>
                                        {host.osVendor && (
                                            <span className="text-xs text-gray-500">{host.osVendor}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Open Ports</h3>
                        {host.ports.length > 0 ? (
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Port</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Proto</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">State</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Version/Info</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {host.ports.map((port, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white font-mono">{port.port}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 uppercase">{port.protocol}</td>
                                                <td className="px-4 py-2 text-sm">
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${port.state === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600'}`}>
                                                        {port.state}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{port.serviceName || '-'}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <div className="flex flex-col">
                                                        {(port.product || port.version) && (
                                                            <span>
                                                                {port.product} {port.version}
                                                            </span>
                                                        )}
                                                        {port.extraInfo && (
                                                            <span className="text-xs text-gray-400">{port.extraInfo}</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No open ports detected via this scan profile.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
