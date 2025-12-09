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
export type ScanProfile = "quick" | "full" | "deep" | "aggressive" | "safe" | "custom";
export interface PortInfo {
    port: number;
    protocol: "tcp" | "udp";
    state: "open" | "closed" | "filtered";
    serviceName?: string;
    product?: string;
    version?: string;
    extraInfo?: string;
}
export interface HostInfo {
    ip: string;
    hostname?: string;
    status: HostStatus;
    ports: PortInfo[];
    osName?: string;
    osAccuracy?: number;
    osVendor?: string;
}
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
