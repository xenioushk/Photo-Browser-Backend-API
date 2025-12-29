import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/errors"
import { ZodError } from "zod"

/**
 * Global error handling middleware
 * Catches all errors and sends appropriate response
 */
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }))

    res.status(400).json({
      error: "Validation failed",
      details: errors,
    })
    return
  }

  // Handle custom operational errors
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      error: err.message,
    })
    return
  }

  // Handle Mongoose duplicate key error
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern)[0]
    res.status(409).json({
      error: `${field} already exists`,
    })
    return
  }

  // Handle Mongoose validation error
  if (err.name === "ValidationError") {
    res.status(400).json({
      error: "Validation failed",
      details: err.message,
    })
    return
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    res.status(400).json({
      error: "Invalid ID format",
    })
    return
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      error: "Invalid token",
    })
    return
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      error: "Token expired",
    })
    return
  }

  // Log unexpected errors
  console.error("❌ Unexpected Error:", err)

  // Send different response based on environment
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
      stack: err.stack,
    })
    return
  }

  // Production: Don't leak error details
  res.status(500).json({
    error: "Internal server error",
  })
}

/**
 * Async handler wrapper to catch errors in async route handlers
 * Eliminates the need for try-catch blocks
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
