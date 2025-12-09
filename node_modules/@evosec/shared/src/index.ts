export type ThemeMode = "light" | "dark";

export interface PingResult {
    target: string;
    rawOutput: string;
    success: boolean;
}

export interface TracerouteResult {
    target: string;
    rawOutput: string;
    success: boolean;
}

export type HostStatus = "up" | "down" | "unknown";

export type ScanProfile =
    | "quick"        // Fast, top ports
    | "full"         // Full ports on common hosts
    | "deep"         // All ports + version + OS
    | "aggressive"   // Nmap -A (OS + scripts + traceroute)
    | "safe"         // Scripts NSE "safe" + version
    | "custom";

export interface PortInfo {
    port: number;
    protocol: "tcp" | "udp";
    state: "open" | "closed" | "filtered";
    serviceName?: string;
    product?: string;      // ej. "Apache httpd"
    version?: string;      // ej. "2.4.52"
    extraInfo?: string;    // ej. "SSL-only"
}

export interface HostInfo {
    ip: string;
    hostname?: string;
    status: HostStatus;
    ports: PortInfo[];
    osName?: string;       // ej. "Linux 3.x"
    osAccuracy?: number;   // ej. 93
    osVendor?: string;     // opcional, si Nmap lo aporta
}

export interface NetworkScanParams {
    target: string; // IP, rango o hostname
    profile: ScanProfile;
    createdBy?: string; // opcional, para auditoría futura
}

export interface NetworkScanResult {
    id: string;
    startedAt: string;
    finishedAt?: string;
    durationMs?: number;
    target: string;
    profile: ScanProfile;
    hosts: HostInfo[];
    summary: {
        totalHosts: number;
        hostsUp: number;
        totalOpenPorts: number;
    };
}
