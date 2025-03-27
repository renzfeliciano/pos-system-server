export const AUTH_CONFIG = () => {
    return Object.freeze({
        ACCESS_TOKEN: process.env.SECRET_KEY_ACCESS_TOKEN,
        REFRESH_TOKEN: process.env.SECRET_KEY_REFRESH_TOKEN,
        ACCESS_TOKEN_EXP: process.env.EXPIRATION_ACCESS_TOKEN,
        REFRESH_TOKEN_EXP: process.env.EXPIRATION_REFRESH_TOKEN,
    })
}