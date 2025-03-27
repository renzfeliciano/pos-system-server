import { Router } from "express"
import AuthController from "./controller"

const AuthRoutes = (router: Router): Router => {
    router
        .post('/login', AuthController.login)
        .post('/register', AuthController.register)
        .post('/logout', AuthController.logout)
        .post('/refresh', AuthController.refreshToken)

    return router
}

export default AuthRoutes