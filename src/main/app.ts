import express, { Express } from "express"
import { EnvProvider } from "../shared/providers/EnvProvider"
import Routes from "./routes"

EnvProvider.load()
const app: Express = express()

app.use(express.json())

app.use('/api/v1', Routes())

export default app