import { AuthRoleEnum } from "./enum"

export interface IAuthPayload {
    _id: string
    username: string
    email: string
    role: AuthRoleEnum
}

export interface IAuthTokens {
    accessToken: string
    refreshToken: string
}

export interface IAuthTokenProvider {
    generateTokens(user: IAuthPayload): {
        accessToken: string
        refreshToken: string
    }
    signAccessToken(payload: IAuthPayload): string
    signRefreshToken(payload: IAuthPayload): string
    verifyAccessToken(token: string): IAuthPayload
    verifyRefreshToken(token: string): IAuthPayload
}