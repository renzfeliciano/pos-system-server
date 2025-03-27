import { Request, Response, NextFunction } from "express"
import AuthService from "./service"

class AuthController {
    constructor(
        private authService: AuthService
    ) {
        this.authService = authService
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.authService.login(req.body)
            res.status(200).json(result)
        } catch (error) {
            next (error)
        }
    }

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.authService.register(req.body)
            res.status(200).json(result)
        } catch (error) {
            next (error)
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.authService.logout(req.body)
            res.status(200).json(result)
        } catch (error) {
            next (error)
        }
    }

    refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.authService.refreshToken(req.body)
            res.status(200).json(result)
        } catch (error) {
            next (error)
        }
    }
}

const authServiceInstance = new AuthService()
const authControllerInstance = new AuthController(authServiceInstance)
export default authControllerInstance