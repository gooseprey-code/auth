import jwt from "jsonwebtoken"
import ENV from "../lib/env.js"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
    const token = req.cookies.accessToken

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET)

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const user = await User
            .findById(decoded.userId)
            .select("-password")

        if (!user) {
            return res.status(401).json({ message: "Unauthorized user" })
        }

        req.user = user

        next()
        
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" })
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" })
        }
        return res.status(500).json({ message: "Internal Server Error" })
    }
}