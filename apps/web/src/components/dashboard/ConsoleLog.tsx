import { useEffect, useRef } from 'react';
import type { ConsoleEntry } from '../../hooks/useEvosecDashboard';
import { Terminal, Trash2 } from 'lucide-react';

interface ConsoleLogProps {
    entries: ConsoleEntry[];
    onClear?: () => void;
}

export function ConsoleLog({ entries, onClear }: ConsoleLogProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [entries]);

    return (
        <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 flex flex-col min-h-[260px] h-[350px]">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm font-semibold tracking-wide text-gray-300">Console Output</span>
                </div>
                {onClear && (
                    <button onClick={onClear} className="text-gray-500 hover:text-white transition-colors p-1 rounded" title="Clear Console">
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2">
                {entries.length === 0 && (
                    <p className="text-gray-600 italic">No logs yet. Waiting for interaction...</p>
                )}
                {entries.map((entry) => {
                    let color = 'text-gray-300';
                    if (entry.type === 'error') color = 'text-red-400';
                    if (entry.type === 'success') color = 'text-green-400';
                    if (entry.type === 'command') color = 'text-blue-400';

                    return (
                        <div key={entry.id} className="flex gap-3">
                            <span className="text-gray-600 shrink-0 select-none text-xs pt-1">
                                {new Date(entry.timestamp).toLocaleTimeString([], { hour12: false })}
                            </span>
                            <span className={`${color} break-all`}>
                                {entry.type === 'command' && <span className="mr-2 opacity-50">$</span>}
                                {entry.message}
                            </span>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
