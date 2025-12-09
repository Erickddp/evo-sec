import type {
    NetworkScanParams,
    NetworkScanResult,
    PingResult,
    TracerouteResult,
} from '@evosec/shared';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface HealthResponse {
    status: string;
    timestamp: string;
    version: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'API Request failed');
    }
    return data as T;
}

async function getHealth(): Promise<HealthResponse> {
    try {
        const res = await fetch(`${API_URL}/health`);
        return handleResponse<HealthResponse>(res);
    } catch (error) {
        console.error('Health check failed:', error);
        throw error;
    }
}

async function getSecurityConfig() {
    const res = await fetch(`${API_URL}/config/security`);
    return handleResponse(res);
}

async function runNetworkScan(params: NetworkScanParams): Promise<NetworkScanResult> {
    const res = await fetch(`${API_URL}/scan/network`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    return handleResponse<NetworkScanResult>(res);
}

async function runPing(target: string): Promise<PingResult> {
    const res = await fetch(`${API_URL}/tools/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target }),
    });
    return handleResponse<PingResult>(res);
}

async function runTraceroute(target: string): Promise<TracerouteResult> {
    const res = await fetch(`${API_URL}/tools/traceroute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target }),
    });
    return handleResponse<TracerouteResult>(res);
}

export const apiClient = {
    health: getHealth,
    getSecurityConfig,
    runNetworkScan,
    runPing,
    runTraceroute,
};
