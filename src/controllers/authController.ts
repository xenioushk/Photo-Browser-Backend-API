import { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User"
import { ConflictError, UnauthorizedError, NotFoundError } from "../utils/errors"
import { asyncHandler } from "../middleware/errorHandler"

// POST /api/auth/register
export const register = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { name, email, username, password, phone, website, address, company } = req.body

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  })

  if (existingUser) {
    throw new ConflictError("User with this email or username already exists")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  const user = await User.create({
    name,
    email,
    username,
    password: hashedPassword,
    phone,
    website,
    address,
    company,
  })

  // Generate JWT token
  const token = jwt.sign({ userId: user._id.toString(), email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "7d" })

  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    },
  })
})

// POST /api/auth/login
export const login = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password } = req.body

  // Find user
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthorizedError("Invalid credentials")
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credentials")
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id.toString(), email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "7d" })

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    },
  })
})

// GET /api/auth/me - Get current user profile
export const getCurrentUser = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const userId = (req as any).user.userId

  const user = await User.findById(userId).select("-password")
  if (!user) {
    throw new NotFoundError("User not found")
  }

  res.json({ user })
})
