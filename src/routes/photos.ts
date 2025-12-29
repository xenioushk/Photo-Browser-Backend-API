import express from "express"
import { getPhotos, getPhotoById, uploadPhoto, updatePhoto, deletePhoto } from "../controllers/photoController"
import { authenticate } from "../middleware/auth"
import { upload } from "../middleware/upload"

const router = express.Router()

router.get("/", getPhotos)
router.get("/:id", getPhotoById)
router.post("/", authenticate, upload.single("image"), uploadPhoto)
router.put("/:id", authenticate, updatePhoto)
router.delete("/:id", authenticate, deletePhoto)

export default router
