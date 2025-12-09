import Fastify from 'fastify';
import cors from '@fastify/cors';
// Justification for Fastify:
// I chose Fastify over Express because it offers significantly better performance (req/sec),
// lower overhead, and built-in TypeScript support which aligns with our full TS stack.
// It also has a robust plugin ecosystem and modern async/await first architecture.
const server = Fastify({
    logger: true
});
// Configure CORS
server.register(cors, {
    origin: '*', // For dev only. In prod, restrict this.
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
});
// Health check
server.get('/health', async (request, reply) => {
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '0.0.1'
    };
});
// Security Config Stub
server.get('/config/security', async (request, reply) => {
    // TODO: Load from env or DB
    return {
        allowedScanRanges: ["192.168.0.0/24"],
        maxConcurrentScans: 2,
        environment: "development"
    };
});
// Start server
const start = async () => {
    try {
        const port = 4000;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on http://localhost:${port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
