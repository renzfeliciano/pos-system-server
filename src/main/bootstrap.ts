import { 
    MongooseProviderInstance,
    RedisClientProviderInstance 
} from "../shared/providers"

const bootstrap = async (): Promise<void> => {
    try {
        console.log("🚀 Bootstrapping application...")

        await Promise.all([
            MongooseProviderInstance.connect(),
            RedisClientProviderInstance.connect(),
        ])

        console.log("✅ All services initialized successfully.")
    } catch (error) {
        console.error("❌ Error during bootstrap:", (error as Error).message)
        process.exit(1) // Exit the process on failure
    }
}

export default bootstrap