import { Router } from "express"
import AuthRoutes from "../features/auth/routes"

export default (): Router => {
    const router = Router()
    const authRoutes = AuthRoutes(router)

    router.use("/auth", authRoutes)

    return router
}