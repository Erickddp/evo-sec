import { useState } from 'react';
import type { NetworkScanResult } from '@evosec/shared';

export type ConsoleEntryType = 'info' | 'success' | 'error' | 'command';

export interface ConsoleEntry {
    id: string;
    type: ConsoleEntryType;
    message: string;
    timestamp: string;
}

interface UseEvosecDashboardResult {
    lastScanResult: NetworkScanResult | null;
    isScanning: boolean;
    consoleEntries: ConsoleEntry[];
    pingOutput: string | null;
    tracerouteOutput: string | null;
    setLastScanResult: (result: NetworkScanResult | null) => void;
    setIsScanning: (value: boolean) => void;
    appendConsole: (entry: Omit<ConsoleEntry, 'id' | 'timestamp'>) => void;
    setPingOutput: (text: string | null) => void;
    setTracerouteOutput: (text: string | null) => void;
    clearConsole: () => void;
}

export function useEvosecDashboard(): UseEvosecDashboardResult {
    const [lastScanResult, setLastScanResult] = useState<NetworkScanResult | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
    const [pingOutput, setPingOutput] = useState<string | null>(null);
    const [tracerouteOutput, setTracerouteOutput] = useState<string | null>(null);

    const appendConsole = (entry: Omit<ConsoleEntry, 'id' | 'timestamp'>) => {
        const newEntry: ConsoleEntry = {
            ...entry,
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `log-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString(),
        };
        setConsoleEntries((prev) => [...prev, newEntry]);
    };

    const clearConsole = () => {
        setConsoleEntries([]);
    };

    return {
        lastScanResult,
        isScanning,
        consoleEntries,
        pingOutput,
        tracerouteOutput,
        setLastScanResult,
        setIsScanning,
        appendConsole,
        setPingOutput,
        setTracerouteOutput,
        clearConsole,
    };
}
