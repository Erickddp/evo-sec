/**
 * Validates if the target is a safe, allowed private network address or localhost.
 * Allowed:
 * - localhost, 127.0.0.1
 * - 192.168.x.x
 * - 10.x.x.x
 * - 172.16.x.x - 172.31.x.x
 */
export function isAllowedTarget(target) {
    // Basic sanity check to prevent command injection characters though child_process.exec handles args,
    // we want to be strict about what looks like a host.
    const cleanTarget = target.trim();
    // Forbidden characters for basic hostname/IP (avoid semicolons, pipes, etc just in case)
    if (/[;&|]/.test(cleanTarget)) {
        return false;
    }
    if (cleanTarget === 'localhost' || cleanTarget === '127.0.0.1') {
        return true;
    }
    // IPv4 Private Blocks
    // 192.168.0.0 - 192.168.255.255
    if (cleanTarget.startsWith('192.168.')) {
        return true;
    }
    // 10.0.0.0 - 10.255.255.255
    if (cleanTarget.startsWith('10.')) {
        return true;
    }
    // 172.16.0.0 - 172.31.255.255
    // Regex to match 172.16..172.31
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(cleanTarget)) {
        return true;
    }
    // Allow standard CIDR notation for the above
    // e.g., 192.168.1.0/24
    // We'll relax the check slightly to allow the /mask part if the prefix matches
    const ipPart = cleanTarget.split('/')[0];
    if (ipPart !== cleanTarget) {
        if (ipPart === 'localhost' || ipPart === '127.0.0.1')
            return true;
        if (ipPart.startsWith('192.168.'))
            return true;
        if (ipPart.startsWith('10.'))
            return true;
        if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ipPart))
            return true;
    }
    return false;
}
export function isAllowedTargetForTools(target) {
    const cleanTarget = target.trim();
    if (!cleanTarget)
        return false;
    // Forbidden characters (injection prevention)
    if (/[;&|]/.test(cleanTarget)) {
        return false;
    }
    // Allow everything that is a private IP (reusing existing logic)
    if (isAllowedTarget(cleanTarget)) {
        return true;
    }
    // Allow public domains and IPs
    // Basic regex for hostname/IP
    // - Must not start with -
    // - Alphanumeric + dots + hyphens
    // - Should look like a domain or IP
    const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    // Simple check 
    if (hostnameRegex.test(cleanTarget)) {
        return true;
    }
    return false;
}
