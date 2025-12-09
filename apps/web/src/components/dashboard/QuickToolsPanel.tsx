import { useState } from 'react';
import { Activity, Route } from 'lucide-react';

interface QuickToolsPanelProps {
    onRunPing: (target: string) => void;
    onRunTraceroute: (target: string) => void;
    pingOutput: string | null;
    tracerouteOutput: string | null;
    isBusy: boolean;
}

export function QuickToolsPanel({ onRunPing, onRunTraceroute, pingOutput, tracerouteOutput, isBusy }: QuickToolsPanelProps) {
    const [target, setTarget] = useState('');

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Tools</h3>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    disabled={isBusy}
                    placeholder="Target IP/Domain"
                    className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                <button
                    onClick={() => onRunPing(target)}
                    disabled={!target || isBusy}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-2 rounded-md transition-colors"
                    title="Ping"
                >
                    <Activity className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onRunTraceroute(target)}
                    disabled={!target || isBusy}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-2 rounded-md transition-colors"
                    title="Traceroute"
                >
                    <Route className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 space-y-4 min-h-[200px]">
                <div className="h-1/2 flex flex-col">
                    <span className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Ping Output</span>
                    <div className="flex-1 bg-gray-950 rounded p-2 overflow-auto font-mono text-xs text-gray-300 border border-gray-800">
                        <pre>{pingOutput || 'No output'}</pre>
                    </div>
                </div>
                <div className="h-1/2 flex flex-col">
                    <span className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Traceroute Output</span>
                    <div className="flex-1 bg-gray-950 rounded p-2 overflow-auto font-mono text-xs text-gray-300 border border-gray-800">
                        <pre>{tracerouteOutput || 'No output'}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
