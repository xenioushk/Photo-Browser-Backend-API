import multer from "multer"
import path from "path"

// Configure multer for memory storage (files stored in memory as Buffer)
const storage = multer.memoryStorage()

// File filter to accept only images
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed extensions
  const allowedExtensions = /jpeg|jpg|png|gif|webp/
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedExtensions.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"))
  }
}

// Multer configuration
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
})
