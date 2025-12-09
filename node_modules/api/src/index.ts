import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { NetworkScanParams } from '@evosec/shared';
import { runNetworkScan, runPing, runTraceroute } from './services/scanner';

// Justification for Fastify:
// I chose Fastify over Express because it offers significantly better performance (req/sec),
// lower overhead, and built-in TypeScript support which aligns with our full TS stack.
// It also has a robust plugin ecosystem and modern async/await first architecture.

const server: FastifyInstance = Fastify({
    logger: true
});

// Configure CORS
server.register(cors, {
    origin: '*', // For dev only
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Health check
server.get('/health', async (_request, _reply) => {
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '0.0.1'
    };
});

// Security Config Stub
server.get('/config/security', async (_request, _reply) => {
    return {
        allowedScanRanges: ["192.168.0.0/24", "10.0.0.0/8", "172.16.0.0/12"],
        maxConcurrentScans: 2,
        environment: "development"
    };
});

// --- Security Tools Endpoints ---

// 1. Network Scan (Nmap)
server.post<{ Body: NetworkScanParams }>('/scan/network', async (request, reply) => {
    const { target, profile } = request.body || {};

    if (!target || !profile) {
        return reply.code(400).send({ error: true, message: "Missing 'target' or 'profile' in body" });
    }

    try {
        const result = await runNetworkScan({ target, profile });
        return result;
    } catch (error: any) {
        server.log.error(error);
        return reply.code(500).send({ error: true, message: error.message || 'Scan failed' });
    }
});

interface ToolParams {
    target: string;
}

// 2. Ping
server.post<{ Body: ToolParams }>('/tools/ping', async (request, reply) => {
    const { target } = request.body || {};
    if (!target) {
        return reply.code(400).send({ error: true, message: "Missing 'target'" });
    }

    try {
        const result = await runPing(target);
        return result;
    } catch (error: any) {
        return reply.code(400).send({ error: true, message: error.message });
    }
});

// 3. Traceroute
server.post<{ Body: ToolParams }>('/tools/traceroute', async (request, reply) => {
    const { target } = request.body || {};
    if (!target) {
        return reply.code(400).send({ error: true, message: "Missing 'target'" });
    }

    try {
        const result = await runTraceroute(target);
        return result;
    } catch (error: any) {
        return reply.code(400).send({ error: true, message: error.message });
    }
});


// Start server
const start = async () => {
    try {
        const port = 4000;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on http://localhost:${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
