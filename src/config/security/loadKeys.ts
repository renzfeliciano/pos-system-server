import fs from "fs"
import path from "path"

type KeyType = "public" | "private"

const loadKeys = (type: KeyType, versions: string[]): Record<string, string> => {
    if (!Array.isArray(versions)) {
        throw new Error(`Invalid parameter: versions must be an array. Received: ${versions}`)
    }

    const keys: Record<string, string> = {}

    versions.forEach((version) => {
        try {
            const keyPath = path.resolve(`src/config/security/keys/${type}-key-${version}.pem`)
            keys[version] = fs.readFileSync(keyPath, "utf8")
        } catch (error) {
            console.error(`Failed to load ${type} key for version: ${version}`, (error as Error).message)
            process.exit(1) // Exit if critical keys are missing
        }
    })

    return keys
}

export default loadKeys