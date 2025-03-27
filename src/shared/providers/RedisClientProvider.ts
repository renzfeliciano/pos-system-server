import { createClient, RedisClientType } from "redis"
import { CACHE_CONFIG } from "../../config/cache.config"
import { handleError } from "../error/errorUtils"

const { HOST, PASS, PORT, CACHE_VALIDITY, MAX_RETRY, RETRY_DELAY } = CACHE_CONFIG()

class RedisClientProvider {
    private static instance: RedisClientProvider
    private client: RedisClientType

    private constructor() {
        this.client = createClient({
            socket: {
                host: HOST,
                port: PORT,
            },
            password: PASS,
        })

        this.attachEventListeners()
    }

    private attachEventListeners(): void {
        this.client.once("error", (err: Error) => {
            console.error("❌ Redis Client Error:", err.message)
        })

        this.client.once("end", async () => {
            console.warn("⚠️  Redis connection closed. Attempting to reconnect...")

            await this.reconnect()
        })
    }

    private async reconnect(): Promise<void> {
        let retryAttempts = 0

        while (retryAttempts < MAX_RETRY) {
            retryAttempts++
            const retryDelay = RETRY_DELAY * Math.pow(2, retryAttempts - 1) // Exponential backoff

            console.log(`🔄 Retrying Redis connection in ${retryDelay / 1000} seconds...`)
            await new Promise((resolve) => setTimeout(resolve, retryDelay))

            try {
                await this.connect()
                console.log("✅ Reconnected to Redis successfully.")
                return
            } catch (error) {
                console.error(`❌ Redis reconnection attempt ${retryAttempts} failed.`)
            }
        }

        console.error("❌ Max reconnection attempts reached. Unable to reconnect to Redis.")
    }

    static getInstance(): RedisClientProvider {
        if (!this.instance) {
            this.instance = new RedisClientProvider()
        }
        return this.instance
    }

    async connect(): Promise<void> {
        if (this.client.isOpen) {
            console.log("⚡ Redis already connected.")
            return
        }

        try {
            await this.client.connect()
            console.log("✅ Redis connected successfully.")
        } catch (error) {
            handleError("connect to Redis", error)
        }
    }

    async disconnect(): Promise<void> {
        if (!this.client.isOpen) {
            console.log("⚠️ No active Redis connection to close.")
            return
        }

        try {
            await this.client.disconnect()
            console.log("✅ Redis connection closed.")
        } catch (error) {
            handleError("disconnect from Redis", error)
        }
    }

    async getCache<T = string>(cacheKey: string, defaultValue: T | null = null): Promise<T | null> {
        try {
            const value = await this.client.get(cacheKey)

            if (!value) return defaultValue

            try {
                return JSON.parse(value) as T
            } catch {
                return value as unknown as T
            }
        } catch (error) {
            handleError("get cache", error)
        }
    }

    async setCache(cacheKey: string, cacheData: string | Record<string, unknown>, ttl: number = CACHE_VALIDITY): Promise<void> {
        try {
            const dataToStore = typeof cacheData === "string" ? cacheData : JSON.stringify(cacheData)
            await this.client.setEx(cacheKey, ttl, dataToStore)
        } catch (error) {
            handleError("set cache", error)
        }
    }

    async deleteCache(cacheKey: string): Promise<boolean> {
        try {
            const result = await this.client.del(cacheKey)
            return result === 1
        } catch (error) {
            handleError("delete cache", error)
        }
    }

    async getAndDeleteCache(cacheKey: string): Promise<string | null> {
        try {
            const cache = await this.client.get(cacheKey)
            if (cache) {
                await this.client.del(cacheKey)
                return cache
            }
            return null
        } catch (error) {
            handleError("get and delete cache", error)
        }
    }
}

const RedisClientProviderInstance = RedisClientProvider.getInstance()
export { RedisClientProviderInstance }