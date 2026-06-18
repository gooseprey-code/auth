import jwt from "jsonwebtoken"
import ENV from "./env.js"

export const generateAccessToken = (userId) => {
    return jwt.sign({userId}, ENV.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
}

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
}