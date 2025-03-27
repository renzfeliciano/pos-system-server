import app from './app'
import { APP_CONFIG } from '../config/app.config'
import bootstrap from './bootstrap'
import shutdownHandler from "./shutdownHandler"

const { NAME, VERSION, PORT, ENVIRONMENT, TIMEOUT } = APP_CONFIG()
const startServer = async () => {
    try {
        await bootstrap()

        const server = app.listen(PORT, () => {
            console.info(`⚡ ${NAME} ${VERSION} server is running at ${ENVIRONMENT} mode on port ${PORT}`)
        })

        shutdownHandler(server, { shutdownTimeout: TIMEOUT })
    } catch (error) {
        console.error('Failed to start server', error)
        process.exit(1)
    }
}

startServer()