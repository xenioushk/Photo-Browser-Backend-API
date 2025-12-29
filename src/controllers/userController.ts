import { Request, Response } from "express"
import User from "../models/User"

// GET /api/users/:id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    return res.json(user)
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user" })
  }
}
