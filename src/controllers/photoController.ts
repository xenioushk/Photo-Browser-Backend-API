import { Request, Response } from "express"
import Photo from "../models/Photo"
import Album from "../models/Album"
import cloudinary from "../config/cloudinary"
import sharp from "sharp"
import { AuthRequest } from "../middleware/auth"

// GET /api/photos?_page=1&_limit=18
export const getPhotos = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query._page as string) || 1
    const limit = parseInt(req.query._limit as string) || 18
    const skip = (page - 1) * limit

    const photos = await Photo.find().skip(skip).limit(limit).populate("albumId", "title").populate("userId", "name email")

    return res.json(photos)
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch photos" })
  }
}

// GET /api/photos/:id
export const getPhotoById = async (req: Request, res: Response) => {
  try {
    const photo = await Photo.findOne({ id: parseInt(req.params.id) })
      .populate("albumId")
      .populate("userId")

    if (!photo) {
      return res.status(404).json({ error: "Photo not found" })
    }

    return res.json(photo)
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch photo" })
  }
}

// GET /api/albums/:albumId/photos?_page=1&_limit=18
export const getPhotosByAlbum = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query._page as string) || 1
    const limit = parseInt(req.query._limit as string) || 18
    const skip = (page - 1) * limit

    const album = await Album.findOne({ id: parseInt(req.params.albumId) })
    if (!album) {
      return res.status(404).json({ error: "Album not found" })
    }

    const photos = await Photo.find({ albumId: album._id }).skip(skip).limit(limit)

    return res.json(photos)
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch photos" })
  }
}

// POST /api/photos - Upload new photo
export const uploadPhoto = async (req: Request, res: Response) => {
  try {
    const { title, albumId } = req.body
    const userId = (req as AuthRequest).user?.userId

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: "Title is required" })
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" })
    }

    // Verify album exists if albumId provided
    let albumObjectId
    if (albumId) {
      const album = await Album.findOne({ id: parseInt(albumId) })
      if (!album) {
        return res.status(404).json({ error: "Album not found" })
      }
      albumObjectId = album._id
    }

    // Process image with Sharp - resize and optimize
    const processedImageBuffer = await sharp(req.file.buffer).resize(800, 800, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 90 }).toBuffer()

    // Create thumbnail
    const thumbnailBuffer = await sharp(req.file.buffer).resize(150, 150, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer()

    // Upload main image to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "photo-browser",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(processedImageBuffer)
    })

    // Upload thumbnail to Cloudinary
    const thumbnailResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "photo-browser/thumbnails",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(thumbnailBuffer)
    })

    // Get the latest photo ID and increment
    const lastPhoto = await Photo.findOne().sort({ id: -1 })
    const newPhotoId = lastPhoto ? lastPhoto.id + 1 : 1

    // Create photo document
    const photo = await Photo.create({
      id: newPhotoId,
      title,
      url: uploadResult.secure_url,
      thumbnailUrl: thumbnailResult.secure_url,
      albumId: albumObjectId,
      userId: userId,
    })

    const populatedPhoto = await Photo.findById(photo._id).populate("albumId", "title").populate("userId", "name email")

    return res.status(201).json({
      message: "Photo uploaded successfully",
      photo: populatedPhoto,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return res.status(500).json({ error: "Failed to upload photo" })
  }
}
