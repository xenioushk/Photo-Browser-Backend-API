import express from "express"
import { getPhotos, getPhotoById, uploadPhoto, updatePhoto, deletePhoto } from "../controllers/photoController"
import { authenticate } from "../middleware/auth"
import { upload } from "../middleware/upload"
import { uploadLimiter } from "../middleware/rateLimiter"

const router = express.Router()

/**
 * @swagger
 * /api/photos:
 *   get:
 *     summary: Get all photos with pagination, search, and filtering
 *     tags: [Photos]
 *     parameters:
 *       - in: query
 *         name: _page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: _limit
 *         schema:
 *           type: integer
 *           default: 18
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by photo title
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: albumId
 *         schema:
 *           type: string
 *         description: Filter by album ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [title, createdAt, updatedAt]
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of photos with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 photos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Photo'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalCount:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 */
router.get("/", getPhotos)

/**
 * @swagger
 * /api/photos/{id}:
 *   get:
 *     summary: Get a single photo by ID
 *     tags: [Photos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Photo ID
 *     responses:
 *       200:
 *         description: Photo details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Photo'
 *       404:
 *         description: Photo not found
 */
router.get("/:id", getPhotoById)

/**
 * @swagger
 * /api/photos:
 *   post:
 *     summary: Upload a new photo
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - title
 *               - albumId
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: "Image file (max 5MB, formats: jpeg, jpg, png, gif, webp)"
 *               title:
 *                 type: string
 *                 example: Beautiful Sunset
 *               albumId:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       201:
 *         description: Photo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 photo:
 *                   $ref: '#/components/schemas/Photo'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too many upload requests
 */
router.post("/", uploadLimiter, authenticate, upload.single("image"), uploadPhoto)

/**
 * @swagger
 * /api/photos/{id}:
 *   put:
 *     summary: Update a photo
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Photo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Title
 *               url:
 *                 type: string
 *                 example: https://example.com/photo.jpg
 *               thumbnailUrl:
 *                 type: string
 *                 example: https://example.com/thumb.jpg
 *     responses:
 *       200:
 *         description: Photo updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to update this photo
 *       404:
 *         description: Photo not found
 */
router.put("/:id", authenticate, updatePhoto)

/**
 * @swagger
 * /api/photos/{id}:
 *   delete:
 *     summary: Delete a photo
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Photo ID
 *     responses:
 *       200:
 *         description: Photo deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to delete this photo
 *       404:
 *         description: Photo not found
 */
router.delete("/:id", authenticate, deletePhoto)

export default router
