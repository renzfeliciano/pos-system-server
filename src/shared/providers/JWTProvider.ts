import jwt from "jsonwebtoken"
import { PUBLIC_KEYS, PRIVATE_KEYS } from "../../config/security/keys"
import { IAuthPayload, IAuthTokenProvider, IAuthTokens } from "../../features/auth/interface"
import { handleError } from "../error/errorUtils"

export class JWTProvider implements IAuthTokenProvider {
    generateTokens(user: IAuthPayload): IAuthTokens {
        const payload: IAuthPayload = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }

        return {
            accessToken: this.signAccessToken(payload),
            refreshToken: this.signRefreshToken(payload),
        }
    }

    signAccessToken(payload: IAuthPayload): string {
        return this.signToken(payload, PRIVATE_KEYS, process.env.PRIVATE_PEM_VERSION || 'v1', "access")
    }

    signRefreshToken(payload: IAuthPayload): string {
        return this.signToken(payload, PUBLIC_KEYS, process.env.PUBLIC_PEM_VERSION || 'v1', "refresh")
    }

    verifyAccessToken(token: string): IAuthPayload {
        return this.verifyToken(token, PRIVATE_KEYS, process.env.PRIVATE_PEM_VERSION)
    }

    verifyRefreshToken(token: string): IAuthPayload {
        return this.verifyToken(token, PUBLIC_KEYS, process.env.PUBLIC_PEM_VERSION)
    }

    private signToken(
        payload: IAuthPayload,
        keys: Record<string, string>,
        keyVersionEnv: string,
        tokenType: "access" | "refresh"
    ): string {
        const keyVersion = keyVersionEnv || "v1"
        if (!keys[keyVersion]) {
            throw new Error(`${tokenType === "access" ? "Private" : "Public"} key for version "${keyVersion}" is not available.`)
        }

        try {
            return jwt.sign(payload, keys[keyVersion], {
                algorithm: "RS256",
                expiresIn: this.getExpirationTime(tokenType),
                keyid: keyVersion,
            })
        } catch (error) {
            handleError(`sign ${tokenType} token`, error)
        }
    }

    private verifyToken(
        token: string,
        keys: Record<string, string>,
        keyVersionEnv: string | undefined
    ): IAuthPayload {
        const keyVersion = keyVersionEnv || "v1"
        if (!keys[keyVersion]) {
            throw new Error(`${keyVersionEnv === process.env.PRIVATE_PEM_VERSION ? "Private" : "Public"} key for version "${keyVersion}" is not available.`)
        }

        try {
            return jwt.verify(token, keys[keyVersion], {
                algorithms: ["RS256"],
            }) as IAuthPayload
        } catch (error) {
            handleError("verify token", error)
        }
    }

    private getExpirationTime(tokenType: "access" | "refresh"): number {
        switch (tokenType) {
            case "access":
                return Number(process.env.EXPIRATION_ACCESS_TOKEN) || 1800 // 30m
            case "refresh":
                return Number(process.env.EXPIRATION_REFRESH_TOKEN) || 604800 // 7d
            default:
                throw new Error("Invalid token type.")
        }
    }
}