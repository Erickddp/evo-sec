import { exec } from 'child_process';
import { promisify } from 'util';
import { XMLParser } from 'fast-xml-parser';
import { randomUUID } from 'node:crypto';
import { NetworkScanParams, NetworkScanResult, HostInfo, PortInfo } from '@evosec/shared';
import { isAllowedTarget } from './validation';

const execAsync = promisify(exec);

export async function runNetworkScan(params: NetworkScanParams): Promise<NetworkScanResult> {
    const { target, profile } = params;

    // 1. Validation
    if (!isAllowedTarget(target)) {
        throw new Error(`Target '${target}' is not allowed. Only private networks and localhost are permitted.`);
    }

    const scanId = randomUUID();
    const startedAt = new Date();

    // 2. Build Nmap Command
    // -oX - : Output XML to stdout
    let args = ['-oX', '-'];

    // Add profile specific arguments
    if (profile === 'full') {
        args.push('-T4', '-p-'); // Aggressive timing, all ports
    } else {
        // Default to 'quick' or 'custom' (treated as quick for now)
        args.push('-T4', '-F'); // Aggressive timing, fast scan (top 100 ports)
    }

    args.push(target);

    const command = `nmap ${args.join(' ')}`;
    console.log(`[Scanner] Executing: ${command}`);

    try {
        // 3. Execute Nmap
        const { stdout, stderr } = await execAsync(command, { maxBuffer: 1024 * 1024 * 10 }); // 10MB buffer

        if (!stdout) {
            throw new Error('Nmap produced no output');
        }

        // 4. Parse XML
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '',
            parseAttributeValue: true
        });

        // Explicitly cast to any to traverse the untyped XML structure
        const result = parser.parse(stdout as string) as any;

        const nmapRun = result.nmaprun;
        if (!nmapRun) {
            throw new Error('Invalid Nmap XML output');
        }

        // 5. Map to NetworkScanResult
        const finishedAt = new Date();
        const durationMs = finishedAt.getTime() - startedAt.getTime();

        const rawHosts = nmapRun.host
            ? (Array.isArray(nmapRun.host) ? nmapRun.host : [nmapRun.host])
            : [];

        const hosts: HostInfo[] = [];
        let totalOpenPorts = 0;

        for (const rawHost of rawHosts) {
            // Check status
            const state = rawHost.status?.state; // 'up', 'down'
            if (state !== 'up') continue;

            // Addresses
            // host.address can be array (ipv4, mac) or single object
            const addresses = Array.isArray(rawHost.address) ? rawHost.address : [rawHost.address];
            const ipv4Addr = addresses.find((a: any) => a.addrtype === 'ipv4');
            const ip = ipv4Addr ? ipv4Addr.addr : 'unknown';

            // Hostnames
            let hostname: string | undefined = undefined;
            if (rawHost.hostnames && rawHost.hostnames.hostname) {
                const names = Array.isArray(rawHost.hostnames.hostname) ? rawHost.hostnames.hostname : [rawHost.hostnames.hostname];
                hostname = names[0]?.name;
            }

            // Ports
            const ports: PortInfo[] = [];
            if (rawHost.ports && rawHost.ports.port) {
                const rawPorts = Array.isArray(rawHost.ports.port) ? rawHost.ports.port : [rawHost.ports.port];

                for (const p of rawPorts) {
                    const portState = p.state?.state; // open, closed, filtered
                    const portNum = parseInt(p.portid, 10);
                    const protocol = p.protocol as 'tcp' | 'udp';
                    const serviceName = p.service?.name;

                    if (portState === 'open') {
                        totalOpenPorts++;
                    }

                    ports.push({
                        port: portNum,
                        protocol: protocol || 'tcp',
                        state: portState || 'closed',
                        serviceName: serviceName
                    });
                }
            }

            hosts.push({
                ip,
                hostname,
                status: 'up',
                ports
            });
        }

        const scanResult: NetworkScanResult = {
            id: scanId,
            startedAt: startedAt.toISOString(),
            finishedAt: finishedAt.toISOString(),
            durationMs,
            target,
            profile,
            hosts,
            summary: {
                totalHosts: hosts.length,
                hostsUp: hosts.length, // logical simplification, since we filtered by status='up'
                totalOpenPorts
            }
        };

        return scanResult;

    } catch (error: any) {
        console.error(`[Scanner] Error executing nmap: ${error.message}`);
        // Determine if it's a fatal error or scan error
        if (error.stderr) console.error(`[Scanner] Stderr: ${error.stderr}`);
        throw new Error(`Scan failed: ${error.message}`);
    }
}
