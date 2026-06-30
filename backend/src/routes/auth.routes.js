import express from "express"
import { addUsername, refresh, forgotPassword, googleAuth, login, logout, resendVerificationToken, signup, suggestedUsernames, uploadImage, usernameAvailability, verifyEmail, resetPassword } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import upload from "../middleware/upload.js"
import {protectAuth, protectEmailVerification, ProtectForgotPassword, ProtectRefresh, ProtectResetPassword } from "../middleware/arcjet.general.js"

const authRoutes = express.Router()

authRoutes.post("/refresh", ProtectRefresh, refresh);

authRoutes.post("/signup", protectAuth, signup)

authRoutes.post("/login", protectAuth, login)

authRoutes.post("/forgot-password", ProtectForgotPassword, forgotPassword)

authRoutes.post("/logout", protectRoute, logout)

authRoutes.post("/verify-email", protectEmailVerification, verifyEmail)

authRoutes.post("/suggested-usernames", protectRoute, suggestedUsernames)

authRoutes.post("/username-availability", protectRoute, usernameAvailability)

authRoutes.post("/add-username", protectRoute, addUsername)

authRoutes.post("/upload-avatar", upload.single("avatar"), protectRoute, uploadImage)

authRoutes.post("/resend-verification-token",protectAuth, resendVerificationToken)

authRoutes.post("/google", protectAuth, googleAuth);

authRoutes.post("/reset-password/:token", ProtectResetPassword, resetPassword)

export default authRoutes