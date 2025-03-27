import loadKeys from "./loadKeys"

const publicPemVersions: string[] = process.env.PUBLIC_PEM_VERSIONS?.split(',') ?? []
const privatePemVersions: string[] = process.env.PRIVATE_PEM_VERSIONS?.split(',') ?? []

// Load public and private keys
export const PUBLIC_KEYS = loadKeys("public", publicPemVersions)
export const PRIVATE_KEYS = loadKeys("private", privatePemVersions)