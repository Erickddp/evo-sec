import { useEffect, useState } from 'react';
import type { ScanProfile, HostInfo } from '@evosec/shared';
import { useEvosecDashboard } from '../../hooks/useEvosecDashboard';
import { apiClient } from '../../lib/apiClient';

// Components
import { ScanForm } from './ScanForm';
import { NetworkSummaryStrip } from './NetworkSummaryStrip';
import { HostsTable } from './HostsTable';
import { HostDetailDrawer } from './HostDetailDrawer';
import { ConsoleLog } from './ConsoleLog';
import { QuickToolsPanel } from './QuickToolsPanel';

export function DashboardShell() {
    const {
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
        clearConsole
    } = useEvosecDashboard();

    const [selectedHost, setSelectedHost] = useState<HostInfo | null>(null);

    // Initial connection check
    useEffect(() => {
        appendConsole({ type: 'info', message: 'Connecting to EVOSEC API...' });
        apiClient.health()
            .then((data) => {
                appendConsole({ type: 'success', message: `Connected to API v${data.version}` });
            })
            .catch((err) => {
                appendConsole({ type: 'error', message: `API Connection Failed: ${err.message}` });
            });
    }, []); // Run once on mount

    const handleRunScan = async (params: { target: string; profile: ScanProfile }) => {
        setIsScanning(true);

        let startMsg = '';
        switch (params.profile) {
            case 'quick': startMsg = `Quick: Starting quick scan on ${params.target}...`; break;
            case 'full': startMsg = `Full: Starting full port scan on ${params.target}...`; break;
            case 'deep': startMsg = `Deep: Starting deep scan (ports + version + OS) on ${params.target}...`; break;
            case 'aggressive': startMsg = `Aggressive: Starting active intelligence scan (-A) on ${params.target}...`; break;
            case 'safe': startMsg = `Safe: Starting safe NSE script scan on ${params.target}...`; break;
            default: startMsg = `Starting ${params.profile} scan on ${params.target}...`; break;
        }
        appendConsole({ type: 'command', message: startMsg });

        try {
            const result = await apiClient.runNetworkScan(params);
            setLastScanResult(result);

            if (result.hosts.length > 0) {
                appendConsole({
                    type: 'success',
                    message: `Scan finished in ${(result.durationMs! / 1000).toFixed(2)} seconds. Found ${result.summary.hostsUp} active hosts and ${result.summary.totalOpenPorts} open ports.`
                });
            } else {
                appendConsole({
                    type: 'info',
                    message: `Scan finished in ${(result.durationMs! / 1000).toFixed(2)} seconds. No active hosts found.`
                });
            }
        } catch (error: any) {
            appendConsole({ type: 'error', message: `Scan failed: ${error.message}` });
        } finally {
            setIsScanning(false);
        }
    };

    const handleRunPing = async (target: string) => {
        appendConsole({ type: 'command', message: `Pinging ${target}...` });
        setIsScanning(true); // Using isScanning as general busy state for simplicity
        setPingOutput('Running...');

        try {
            const result = await apiClient.runPing(target);
            setPingOutput(result.rawOutput);
            if (result.success) {
                appendConsole({ type: 'success', message: `Ping to ${target} completed.` });
            } else {
                appendConsole({ type: 'error', message: `Ping to ${target} failed (non-zero exit).` });
            }
        } catch (error: any) {
            setPingOutput(`Error: ${error.message}`);
            appendConsole({ type: 'error', message: `Ping error: ${error.message}` });
        } finally {
            setIsScanning(false);
        }
    };

    const handleRunTraceroute = async (target: string) => {
        appendConsole({ type: 'command', message: `Tracing route to ${target}...` });
        setIsScanning(true);
        setTracerouteOutput('Running...');

        try {
            const result = await apiClient.runTraceroute(target);
            setTracerouteOutput(result.rawOutput);
            if (result.success) {
                appendConsole({ type: 'success', message: `Traceroute to ${target} completed.` });
            } else {
                appendConsole({ type: 'error', message: `Traceroute to ${target} failed.` });
            }
        } catch (error: any) {
            setTracerouteOutput(`Error: ${error.message}`);
            appendConsole({ type: 'error', message: `Traceroute error: ${error.message}` });
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* 1. Summary Strip */}
            <NetworkSummaryStrip scanResult={lastScanResult} />

            {/* 2. Main Action Area: Scan & Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <ScanForm onRunScan={handleRunScan} isScanning={isScanning} />
                </div>
                <div>
                    <QuickToolsPanel
                        onRunPing={handleRunPing}
                        onRunTraceroute={handleRunTraceroute}
                        pingOutput={pingOutput}
                        tracerouteOutput={tracerouteOutput}
                        isBusy={isScanning}
                    />
                </div>
            </div>

            {/* 3. Results Table */}
            <HostsTable hosts={lastScanResult?.hosts || []} onSelectHost={setSelectedHost} />

            {/* 4. Large Console Log */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
                <ConsoleLog entries={consoleEntries} onClear={clearConsole} />
            </section>

            <HostDetailDrawer host={selectedHost} onClose={() => setSelectedHost(null)} />
        </div>
    );
}
