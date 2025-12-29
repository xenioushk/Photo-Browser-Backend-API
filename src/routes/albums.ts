import express from "express"
import { getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum } from "../controllers/albumController"
import { getPhotosByAlbum } from "../controllers/photoController"
import { authenticate } from "../middleware/auth"

const router = express.Router()

/**
 * @swagger
 * /api/albums:
 *   get:
 *     summary: Get all albums with pagination, search, and filtering
 *     tags: [Albums]
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
 *         description: Search by album title
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
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
 *         description: List of albums with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 albums:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Album'
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
 */
router.get("/", getAlbums)

/**
 * @swagger
 * /api/albums/{id}:
 *   get:
 *     summary: Get a single album by ID
 *     tags: [Albums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *     responses:
 *       200:
 *         description: Album details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Album'
 *       404:
 *         description: Album not found
 */
router.get("/:id", getAlbumById)

/**
 * @swagger
 * /api/albums/{albumId}/photos:
 *   get:
 *     summary: Get all photos in an album
 *     tags: [Albums]
 *     parameters:
 *       - in: path
 *         name: albumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *     responses:
 *       200:
 *         description: List of photos in the album
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Photo'
 */
router.get("/:albumId/photos", getPhotosByAlbum)

/**
 * @swagger
 * /api/albums:
 *   post:
 *     summary: Create a new album
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Vacation Photos 2024
 *               userId:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       201:
 *         description: Album created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 album:
 *                   $ref: '#/components/schemas/Album'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, createAlbum)

/**
 * @swagger
 * /api/albums/{id}:
 *   put:
 *     summary: Update an album
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Album Title
 *     responses:
 *       200:
 *         description: Album updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to update this album
 *       404:
 *         description: Album not found
 */
router.put("/:id", authenticate, updateAlbum)

/**
 * @swagger
 * /api/albums/{id}:
 *   delete:
 *     summary: Delete an album
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Album ID
 *     responses:
 *       200:
 *         description: Album deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to delete this album
 *       404:
 *         description: Album not found
 */
router.delete("/:id", authenticate, deleteAlbum)

export default router
