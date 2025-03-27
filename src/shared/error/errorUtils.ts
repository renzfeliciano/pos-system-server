export function handleError(operationName: string, error: unknown): never {
    if (error instanceof Error) {
        console.error(`Error during ${operationName}:`, error.message)
    } else {
        console.error(`Unknown error during ${operationName}:`, error)
    }
    
    throw new Error(`Error during ${operationName}`)
}