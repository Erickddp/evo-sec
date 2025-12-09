export type ThemeMode = "light" | "dark";
export type HostStatus = "up" | "down" | "unknown";
export interface PortInfo {
    port: number;
    protocol: "tcp" | "udp";
    state: "open" | "closed" | "filtered";
    serviceName?: string;
}
export interface HostInfo {
    ip: string;
    hostname?: string;
    status: HostStatus;
    ports: PortInfo[];
}
export type ScanProfile = "quick" | "full" | "custom";
export interface NetworkScanParams {
    target: string;
    profile: ScanProfile;
    createdBy?: string;
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
