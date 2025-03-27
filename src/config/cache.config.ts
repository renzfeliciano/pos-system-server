export const CACHE_CONFIG = () => {
    return Object.freeze({
        HOST: process.env.REDIS_HOST,
        PASS: process.env.REDIS_PASS,
        PORT: Number(process.env.REDIS_PORT),
        CACHE_VALIDITY: Number(process.env.REDIS_CACHE_VALIDITY),
        MAX_RETRY: Number(process.env.REDIS_MAX_RETRIES),
        RETRY_DELAY: Number(process.env.REDIS_RETRY_DELAY),
    })
}