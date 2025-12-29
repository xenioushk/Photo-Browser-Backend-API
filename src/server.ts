import express, { Application, Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import connectDatabase from "./config/database"

// Rate limiters
import { apiLimiter } from "./middleware/rateLimiter"

// Error handler
import { errorHandler } from "./middleware/errorHandler"

// Routes
import authRoutes from "./routes/auth"
import photoRoutes from "./routes/photos"
import albumRoutes from "./routes/albums"
import userRoutes from "./routes/users"

// Load environment variables
dotenv.config()

// Create Express app
const app: Application = express()

// Connect to MongoDB
connectDatabase()

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
)
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Apply general rate limiting to all API routes
app.use("/api", apiLimiter)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/photos", photoRoutes)
app.use("/api/albums", albumRoutes)
app.use("/api/users", userRoutes)

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", message: "Photo Browser API is running" })
})

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" })
})

// Global error handler (must be last)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`)
})

export default app
