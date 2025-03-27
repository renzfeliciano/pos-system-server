export const APP_CONFIG = () => {
    return Object.freeze({
        NAME: process.env.APP_NAME,
        VERSION: process.env.APP_VERSION,
        ENVIRONMENT: process.env.APP_ENVIRONMENT,
        PORT: Number(process.env.APP_PORT),
        TIMEOUT: Number(process.env.APP_SHUTDOWN_TIMEOUT),
    })
}