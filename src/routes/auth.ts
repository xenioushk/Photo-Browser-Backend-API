import express from "express"
import { register, login, getCurrentUser } from "../controllers/authController"
import { authenticate } from "../middleware/auth"
import { authLimiter } from "../middleware/rateLimiter"

const router = express.Router()

// Apply stricter rate limiting to auth routes
router.post("/register", authLimiter, register)
router.post("/login", authLimiter, login)
router.get("/me", authenticate, getCurrentUser)

export default router
