const isDev = import.meta.env.DEV

export const logger = {
    debug(...args: any[]): void {
        if (isDev) console.debug('[DEBUG]', ...args)
    },
    info(...args: any[]): void {
        if (isDev) console.info('[INFO]', ...args)
        // In production, we could send this to a mock analytics provider
    },
    warn(...args: any[]): void {
        console.warn('[WARN]', ...args)
    },
    error(...args: any[]): void {
        console.error('[ERROR]', ...args)
        // Track error in analytics
    },
    trackEvent(name: string, properties?: any): void {
        if (!isDev) {
            // Mock analytics implementation
            console.log(`[ANALYTICS] Tracking event: ${name}`, properties)
        } else {
            console.debug(`[ANALYTICS-DEV] Event: ${name}`, properties)
        }
    },
}
