import express from "express"
import { addUsername, refresh, forgotPassword, googleAuth, login, logout, resendVerificationToken, signup, suggestedUsernames, uploadImage, usernameAvailability, verifyEmail } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import upload from "../middleware/upload.js"

const authRoutes = express.Router()

authRoutes.post("/refresh", refresh);

authRoutes.post("/signup", signup)

authRoutes.post("/login", login)

authRoutes.post("/forgot-password", forgotPassword)

authRoutes.post("/logout", protectRoute, logout)

authRoutes.post("/verify-email", verifyEmail)

authRoutes.post("/suggested-usernames", protectRoute, suggestedUsernames)

authRoutes.post("/username-availability", protectRoute, usernameAvailability)

authRoutes.post("/add-username", protectRoute, addUsername)

authRoutes.post("/upload-avatar", upload.single("avatar"), protectRoute, uploadImage)

authRoutes.post("/resend-verification-token", resendVerificationToken)

authRoutes.post("/google", googleAuth);


export default authRoutes