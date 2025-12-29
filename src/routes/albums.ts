import express from "express"
import { getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum } from "../controllers/albumController"
import { getPhotosByAlbum } from "../controllers/photoController"
import { authenticate } from "../middleware/auth"

const router = express.Router()

router.get("/", getAlbums)
router.get("/:id", getAlbumById)
router.get("/:albumId/photos", getPhotosByAlbum)
router.post("/", authenticate, createAlbum)
router.put("/:id", authenticate, updateAlbum)
router.delete("/:id", authenticate, deleteAlbum)

export default router
