import mongoose, { Connection } from "mongoose"
import { DATABASE_CONFIG } from "../../config/database.config"

const { URI = "", MAX_RETRIES, RETRY_DELAY, DEFAULT_OPTIONS } = DATABASE_CONFIG()

class MongooseProvider {
    private static instance: MongooseProvider
    private connection: Connection | null = null

    private constructor() {
        this.setupEventListeners()
    }

    private setupEventListeners(): void {
        mongoose.connection.on("connected", () => {
            console.log("✅ MongoDB connected successfully.")
        })

        mongoose.connection.on("error", (err: Error) => {
            console.error("❌ MongoDB connection error:", err.message)
        })

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...")
            this.connection = null
            this.reconnect()
        })
    }

    private async reconnect(): Promise<void> {
        let attempt = 0

        while (attempt < MAX_RETRIES) {
            try {
                console.log(`🔄 Attempting to reconnect to MongoDB (${attempt + 1}/${MAX_RETRIES})...`)
                await mongoose.connect(URI, DEFAULT_OPTIONS)
                this.connection = mongoose.connection
                console.log("✅ Reconnected to MongoDB successfully.")
                return
            } catch (error) {
                attempt++
                console.error(`❌ MongoDB reconnection failed. Attempt ${attempt}/${MAX_RETRIES}:`, (error as Error).message)

                if (attempt < MAX_RETRIES) {
                    console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`)
                    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
                } else {
                    console.error("❌ Max retry attempts reached. Unable to reconnect to MongoDB.")
                }
            }
        }
    }

    static getInstance(): MongooseProvider {
        if (!this.instance) {
            this.instance = new MongooseProvider()
        }
        return this.instance
    }

    async connect(): Promise<Connection> {
        if (this.connection) {
            console.log("⚡ Using existing MongoDB connection.")
            return this.connection
        }

        try {
            await mongoose.connect(URI, DEFAULT_OPTIONS)
            this.connection = mongoose.connection
            return this.connection
        } catch (error) {
            console.error("❌ Error connecting to MongoDB:", (error as Error).message)
            throw error
        }
    }

    async disconnect(): Promise<void> {
        if (!this.connection) {
            console.log("⚠️ No active MongoDB connection to close.")
            return
        }

        try {
            await mongoose.connection.close()
            console.log("✅ MongoDB connection closed.")
            this.connection = null
        } catch (error) {
            console.error("❌ Error closing MongoDB connection:", (error as Error).message)
            throw error
        }
    }
}

const MongooseProviderInstance = MongooseProvider.getInstance()
export { MongooseProviderInstance }