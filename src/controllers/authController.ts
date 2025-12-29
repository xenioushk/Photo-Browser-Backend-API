import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User"

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, username, password, phone, website, address, company } = req.body

    // Validate required fields
    if (!name || !email || !username || !password) {
      return res.status(400).json({ error: "Please provide name, email, username, and password" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({ error: "User with this email or username already exists" })
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

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return res.status(500).json({ error: "Registration failed" })
  }
}

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id.toString(), email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "7d" })

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ error: "Login failed" })
  }
}

// GET /api/auth/me - Get current user profile
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId

    const user = await User.findById(userId).select("-password")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    return res.json({ user })
  } catch (error) {
    console.error("Get current user error:", error)
    return res.status(500).json({ error: "Failed to fetch user" })
  }
}
