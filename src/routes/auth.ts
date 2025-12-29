import express from "express"
import { register, login, getCurrentUser } from "../controllers/authController"
import { authenticate } from "../middleware/auth"
import { authLimiter } from "../middleware/rateLimiter"
import { validateBody } from "../middleware/validateRequest"
import { registerSchema, loginSchema } from "../schemas/authSchemas"

const router = express.Router()

// Apply stricter rate limiting and validation to auth routes
router.post("/register", authLimiter, validateBody(registerSchema), register)
router.post("/login", authLimiter, validateBody(loginSchema), login)
router.get("/me", authenticate, getCurrentUser)

export default router
