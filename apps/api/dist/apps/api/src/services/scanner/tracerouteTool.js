import { exec } from 'child_process';
import { promisify } from 'util';
import { isAllowedTargetForTools } from './validation';
const execAsync = promisify(exec);
export async function runTraceroute(target) {
    if (!isAllowedTargetForTools(target)) {
        throw new Error(`Target '${target}' is not allowed.`);
    }
    const isWin = process.platform === 'win32';
    // Windows: tracert, Unix: traceroute
    const bin = isWin ? 'tracert' : 'traceroute';
    // On Windows, tracert can be slow to resolve names, -d prevents resolution (optional, keeping default for now)
    const command = `${bin} ${target}`;
    console.log(`[Tools] Executing: ${command}`);
    try {
        const { stdout } = await execAsync(command);
        return {
            target,
            rawOutput: stdout,
            success: true
        };
    }
    catch (error) {
        return {
            target,
            rawOutput: error.stdout || error.message,
            success: false
        };
    }
}
