import { Server } from "http" 
import { 
    MongooseProviderInstance, 
    RedisClientProviderInstance 
} from "../shared/providers"

type Signal = "SIGINT" | "SIGTERM" 
type ShutdownOptions = {
    shutdownTimeout?: number // Optional timeout in milliseconds
}

const shutdownHandler = (server: Server, options: ShutdownOptions = {}): void => {
    const { shutdownTimeout = 10000 } = options // Default timeout to 10 seconds

    const gracefulShutdown = async (signal: Signal): Promise<void> => {
        console.warn(`Received ${signal}, initiating graceful shutdown...`)

        try {
            await MongooseProviderInstance.disconnect()
            await RedisClientProviderInstance.disconnect()

            const timeout = setTimeout(() => {
                console.error("Shutdown timeout exceeded. Forcing exit...")
                process.exit(1)
            }, shutdownTimeout)

            server.close((err) => {
                clearTimeout(timeout) 

                if (err) {
                    console.error("Error shutting down server:", err.message)
                    process.exit(1)
                } else {
                    console.info("✅ Server shut down successfully.")
                    process.exit(0)
                }
            })
        } catch (err) {
            console.error("Error during graceful shutdown:", (err as Error).message)
            process.exit(1)
        }
    }

    const signals: Signal[] = ["SIGINT", "SIGTERM"]
    signals.forEach((signal) => {
        process.on(signal, () => gracefulShutdown(signal))
    })

    process.on("uncaughtException", (err: Error) => {
        console.error("Uncaught Exception:", err.message, { stack: err.stack })
        process.exit(1)
    })

    process.on("unhandledRejection", (reason: unknown, promise: Promise<unknown>) => {
        console.error("Unhandled Promise Rejection:", reason, { promise })
        process.exit(1)
    })
}

export default shutdownHandler