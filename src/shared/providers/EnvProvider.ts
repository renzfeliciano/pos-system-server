import { config } from "dotenv-safe"
import { resolve } from "path"

export class EnvProvider {
    static load(): void {
        try {
            config({
                allowEmptyValues: false, 
                example: resolve(process.cwd(), ".env.example"),
            })
            console.log("✅ Environment variables loaded successfully.")
        } catch (error) {
            console.error("❌ Failed to load environment variables:", (error as Error).message)
            process.exit(1) 
        }
    }
}