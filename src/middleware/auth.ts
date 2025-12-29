import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UnauthorizedError } from "../utils/errors"

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided")
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string
      email: string
    }

    // Attach user info to request
    ;(req as AuthRequest).user = decoded

    next()
  } catch (error) {
    // Pass error to error handler middleware
    next(error)
  }
}
