import { exec } from 'child_process';
import { promisify } from 'util';
import { PingResult } from '@evosec/shared';
import { isAllowedTarget } from './validation';

const execAsync = promisify(exec);

export async function runPing(target: string): Promise<PingResult> {
    if (!isAllowedTarget(target)) {
        throw new Error(`Target '${target}' is not allowed.`);
    }

    const isWin = process.platform === 'win32';
    // Windows: -n 4, Unix: -c 4
    const countFlag = isWin ? '-n' : '-c';
    const command = `ping ${countFlag} 4 ${target}`;

    console.log(`[Tools] Executing: ${command}`);

    try {
        const { stdout } = await execAsync(command);
        return {
            target,
            rawOutput: stdout,
            success: true
        };
    } catch (error: any) {
        // Ping command returns non-zero exit code if host unreachable, which throws error in execAsync
        // We want to return the output anyway if possible, but mark success: false
        // execAsync error object often contains stdout even on failure
        return {
            target,
            rawOutput: error.stdout || error.message,
            success: false
        };
    }
}
