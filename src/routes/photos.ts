import express from "express"
import { getPhotos, getPhotoById, uploadPhoto } from "../controllers/photoController"
import { authenticate } from "../middleware/auth"
import { upload } from "../middleware/upload"

const router = express.Router()

router.get("/", getPhotos)
router.get("/:id", getPhotoById)
router.post("/", authenticate, upload.single("image"), uploadPhoto)

export default router
