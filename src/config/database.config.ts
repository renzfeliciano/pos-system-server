import { ConnectOptions } from "mongoose"

type DatabaseConfig = {
    URI: string
    MAX_POOL_SIZE: number
    MAX_RETRIES: number
    RETRY_DELAY: number
    SERVER_SELECTION_TIMEOUT: number
    DEFAULT_OPTIONS: ConnectOptions
}

export const DATABASE_CONFIG = (): DatabaseConfig => {
    return Object.freeze({
        URI: process.env.MONGODB_URI || '',
        MAX_POOL_SIZE: Number(process.env.MONGODB_MAX_POOL_SIZE),
        MAX_RETRIES: Number(process.env.MONGODB_MAX_RETRIES),
        RETRY_DELAY: Number(process.env.MONGODB_RETRY_DELAY),
        SERVER_SELECTION_TIMEOUT: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT),
        DEFAULT_OPTIONS: {
            maxPoolSize:  Number(process.env.MONGODB_MAX_POOL_SIZE),
            serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT),
            retryWrites: true,
            retryReads: true,
        }
    })
}