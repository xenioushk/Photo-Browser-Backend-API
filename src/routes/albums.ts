import express from "express"
import { getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum } from "../controllers/albumController"
import { getPhotosByAlbum } from "../controllers/photoController"
import { authenticate } from "../middleware/auth"
import { validateBody, validateQuery } from "../middleware/validateRequest"
import { createAlbumSchema, updateAlbumSchema, albumQuerySchema } from "../schemas/albumSchemas"

const router = express.Router()

router.get("/", validateQuery(albumQuerySchema), getAlbums)
router.get("/:id", getAlbumById)
router.get("/:albumId/photos", getPhotosByAlbum)
router.post("/", authenticate, validateBody(createAlbumSchema), createAlbum)
router.put("/:id", authenticate, validateBody(updateAlbumSchema), updateAlbum)
router.delete("/:id", authenticate, deleteAlbum)

export default router
