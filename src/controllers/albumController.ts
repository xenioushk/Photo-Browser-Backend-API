import { Request, Response } from "express"
import Album from "../models/Album"
import Photo from "../models/Photo"
import { AuthRequest } from "../middleware/auth"

// GET /api/albums?_page=1&_limit=18&search=vacation&userId=123&sort=title&order=asc
export const getAlbums = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query._page as string) || 1
    const limit = parseInt(req.query._limit as string) || 18
    const skip = (page - 1) * limit
    const search = req.query.search as string
    const userId = req.query.userId as string
    const sort = (req.query.sort as string) || "createdAt"
    const order = (req.query.order as string) === "asc" ? 1 : -1

    // Build query filter
    const filter: any = {}

    // Search by title (case-insensitive)
    if (search) {
      filter.title = { $regex: search, $options: "i" }
    }

    // Filter by userId
    if (userId) {
      filter.userId = userId
    }

    // Get total count for pagination metadata
    const totalCount = await Album.countDocuments(filter)
    const totalPages = Math.ceil(totalCount / limit)

    // Build sort object
    const sortObj: any = {}
    sortObj[sort] = order

    // Fetch albums with filters and sorting
    const albums = await Album.find(filter).sort(sortObj).skip(skip).limit(limit).populate("userId", "name email")

    return res.json({
      albums,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch albums" })
  }
}

// GET /api/albums/:id
export const getAlbumById = async (req: Request, res: Response) => {
  try {
    const album = await Album.findOne({ id: parseInt(req.params.id) }).populate("userId")

    if (!album) {
      return res.status(404).json({ error: "Album not found" })
    }

    return res.json(album)
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch album" })
  }
}

// POST /api/albums - Create new album
export const createAlbum = async (req: Request, res: Response) => {
  try {
    const { title } = req.body
    const userId = (req as AuthRequest).user?.userId

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: "Title is required" })
    }

    // Get the latest album ID and increment
    const lastAlbum = await Album.findOne().sort({ id: -1 })
    const newAlbumId = lastAlbum ? lastAlbum.id + 1 : 1

    // Create album
    const album = await Album.create({
      id: newAlbumId,
      title,
      userId: userId,
    })

    const populatedAlbum = await Album.findById(album._id).populate("userId", "name email")

    return res.status(201).json({
      message: "Album created successfully",
      album: populatedAlbum,
    })
  } catch (error) {
    console.error("Create album error:", error)
    return res.status(500).json({ error: "Failed to create album" })
  }
}

// PUT /api/albums/:id - Update album
export const updateAlbum = async (req: Request, res: Response) => {
  try {
    const { title } = req.body
    const userId = (req as AuthRequest).user?.userId
    const albumId = parseInt(req.params.id)

    // Find album
    const album = await Album.findOne({ id: albumId })
    if (!album) {
      return res.status(404).json({ error: "Album not found" })
    }

    // Check if user owns this album
    if (album.userId.toString() !== userId) {
      return res.status(403).json({ error: "You can only update your own albums" })
    }

    // Update title
    if (title) album.title = title

    await album.save()

    const updatedAlbum = await Album.findById(album._id).populate("userId", "name email")

    return res.json({
      message: "Album updated successfully",
      album: updatedAlbum,
    })
  } catch (error) {
    console.error("Update album error:", error)
    return res.status(500).json({ error: "Failed to update album" })
  }
}

// DELETE /api/albums/:id - Delete album
export const deleteAlbum = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.userId
    const albumId = parseInt(req.params.id)

    // Find album
    const album = await Album.findOne({ id: albumId })
    if (!album) {
      return res.status(404).json({ error: "Album not found" })
    }

    // Check if user owns this album
    if (album.userId.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own albums" })
    }

    // Check if album has photos
    const photoCount = await Photo.countDocuments({ albumId: album._id })
    if (photoCount > 0) {
      return res.status(400).json({
        error: `Cannot delete album. It contains ${photoCount} photo(s). Please delete or move the photos first.`,
      })
    }

    // Delete album
    await Album.findByIdAndDelete(album._id)

    return res.json({
      message: "Album deleted successfully",
    })
  } catch (error) {
    console.error("Delete album error:", error)
    return res.status(500).json({ error: "Failed to delete album" })
  }
}
