import { Request, Response } from "express"
import Photo from "../models/Photo"
import Album from "../models/Album"
import cloudinary from "../config/cloudinary"
import sharp from "sharp"
import { AuthRequest } from "../middleware/auth"

// GET /api/photos?_page=1&_limit=18&search=sunset&userId=123&albumId=5&sort=createdAt&order=desc
export const getPhotos = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query._page as string) || 1
    const limit = parseInt(req.query._limit as string) || 18
    const skip = (page - 1) * limit
    const search = req.query.search as string
    const userId = req.query.userId as string
    const albumId = req.query.albumId as string
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

    // Filter by albumId
    if (albumId) {
      const album = await Album.findOne({ id: parseInt(albumId) })
      if (album) {
        filter.albumId = album._id
      }
    }

    // Get total count for pagination metadata
    const totalCount = await Photo.countDocuments(filter)
    const totalPages = Math.ceil(totalCount / limit)

    // Build sort object
    const sortObj: any = {}
    sortObj[sort] = order

    // Fetch photos with filters and sorting
    const photos = await Photo.find(filter).sort(sortObj).skip(skip).limit(limit).populate("albumId", "title").populate("userId", "name email")

    return res.json({
      photos,
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

// PUT /api/photos/:id - Update photo
export const updatePhoto = async (req: Request, res: Response) => {
  try {
    const { title, albumId } = req.body
    const userId = (req as AuthRequest).user?.userId
    const photoId = parseInt(req.params.id)

    // Find photo
    const photo = await Photo.findOne({ id: photoId })
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" })
    }

    // Check if user owns this photo
    if (photo.userId.toString() !== userId) {
      return res.status(403).json({ error: "You can only update your own photos" })
    }

    // Verify album exists if albumId provided
    if (albumId) {
      const album = await Album.findOne({ id: parseInt(albumId) })
      if (!album) {
        return res.status(404).json({ error: "Album not found" })
      }
      photo.albumId = album._id
    }

    // Update fields
    if (title) photo.title = title

    await photo.save()

    const updatedPhoto = await Photo.findById(photo._id).populate("albumId", "title").populate("userId", "name email")

    return res.json({
      message: "Photo updated successfully",
      photo: updatedPhoto,
    })
  } catch (error) {
    console.error("Update error:", error)
    return res.status(500).json({ error: "Failed to update photo" })
  }
}

// DELETE /api/photos/:id - Delete photo
export const deletePhoto = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.userId
    const photoId = parseInt(req.params.id)

    // Find photo
    const photo = await Photo.findOne({ id: photoId })
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" })
    }

    // Check if user owns this photo
    if (photo.userId.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own photos" })
    }

    // Extract public ID from Cloudinary URL to delete the image
    const urlParts = photo.url.split("/")
    const publicIdWithExt = urlParts[urlParts.length - 1]
    const publicId = `photo-browser/${publicIdWithExt.split(".")[0]}`

    const thumbnailParts = photo.thumbnailUrl.split("/")
    const thumbnailIdWithExt = thumbnailParts[thumbnailParts.length - 1]
    const thumbnailPublicId = `photo-browser/thumbnails/${thumbnailIdWithExt.split(".")[0]}`

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId)
      await cloudinary.uploader.destroy(thumbnailPublicId)
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError)
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await Photo.findByIdAndDelete(photo._id)

    return res.json({
      message: "Photo deleted successfully",
    })
  } catch (error) {
    console.error("Delete error:", error)
    return res.status(500).json({ error: "Failed to delete photo" })
  }
}
