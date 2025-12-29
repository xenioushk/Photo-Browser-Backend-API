import { z } from "zod"

// Upload photo schema (for multipart form data)
export const uploadPhotoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters"),
  albumId: z.string().min(1, "Album ID is required").regex(/^\d+$/, "Album ID must be a valid number"),
})

// Update photo schema
export const updatePhotoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters").optional(),
  url: z.string().url("Invalid URL").optional(),
  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
})

// Query parameters schema for filtering/searching
export const photoQuerySchema = z.object({
  _page: z.string().regex(/^\d+$/, "Page must be a number").transform(Number).optional(),
  _limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform(Number)
    .refine((val) => !val || (val > 0 && val <= 100), "Limit must be between 1 and 100")
    .optional(),
  search: z.string().max(100, "Search term too long").optional(),
  userId: z.string().regex(/^\d+$/, "User ID must be a number").optional(),
  albumId: z.string().regex(/^\d+$/, "Album ID must be a number").optional(),
  sort: z.enum(["title", "createdAt", "updatedAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
})

// Type exports
export type UploadPhotoInput = z.infer<typeof uploadPhotoSchema>
export type UpdatePhotoInput = z.infer<typeof updatePhotoSchema>
export type PhotoQueryInput = z.infer<typeof photoQuerySchema>
