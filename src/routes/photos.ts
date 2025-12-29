import express from "express"
import { getPhotos, getPhotoById, uploadPhoto, updatePhoto, deletePhoto } from "../controllers/photoController"
import { authenticate } from "../middleware/auth"
import { upload } from "../middleware/upload"
import { uploadLimiter } from "../middleware/rateLimiter"
import { validateBody, validateQuery } from "../middleware/validateRequest"
import { uploadPhotoSchema, updatePhotoSchema, photoQuerySchema } from "../schemas/photoSchemas"

const router = express.Router()

router.get("/", validateQuery(photoQuerySchema), getPhotos)
router.get("/:id", getPhotoById)
// Apply upload rate limiter and validation to photo uploads
router.post("/", uploadLimiter, authenticate, upload.single("image"), validateBody(uploadPhotoSchema), uploadPhoto)
router.put("/:id", authenticate, validateBody(updatePhotoSchema), updatePhoto)
router.delete("/:id", authenticate, deletePhoto)

export default router
