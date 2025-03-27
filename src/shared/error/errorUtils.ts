export function handleError(context: string, error: unknown): void {
    console.error(`${context}:`, error)

    if (error instanceof Error) {
        console.error(`${context}: ${error.message}`)
        throw new Error(`${context}: ${error.message}`)
    } else {
        console.error(`${context}: An unknown error occurred:`, error)
        throw new Error(`${context}: An unknown error occurred`)
    }
}