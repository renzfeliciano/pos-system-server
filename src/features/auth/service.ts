import { handleError } from "../../shared/error/errorUtils"
import { ILoginPayload } from "./interface"

class AuthService {
    constructor() {}

    login = async (payload: ILoginPayload): Promise<{ isAuthenticated: boolean }> => {
        try {
            const { username, password } = payload
            console.info(`username: ${username}, password: ${password}`)
            const result = {
                isAuthenticated: true
            }
            
            return result
        } catch (error) {
            handleError("Error on AuthService.login", error)
        }
    }

    register = async (data: any): Promise<{ isRegistered: boolean }> => {
        try {
            const result = {
                isRegistered: true
            }
            
            return result
        } catch (error) {
            handleError("Error on AuthService.register", error)
        }
    }

    logout = async (data: any): Promise<{ isLoggedOut: boolean }> => {
        try {
            const result = {
                isLoggedOut: true
            }
            
            return result
        } catch (error) {
            handleError("Error on AuthService.logout", error)
        }
    }

    refreshToken = async (data: any): Promise<{ isRefreshed: boolean }> => {
        try {
            const result = {
                isRefreshed: true
            }
            
            return result
        } catch (error) {
            handleError("Error on AuthService.refreshToken", error)
        }
    }
}

export default AuthService