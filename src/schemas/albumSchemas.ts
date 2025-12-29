import { z } from "zod"

// Create album schema
export const createAlbumSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters"),
  userId: z.string().regex(/^\d+$/, "User ID must be a valid number").optional(), // Optional because we can get it from authenticated user
})

// Update album schema
export const updateAlbumSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters").optional(),
})

// Query parameters schema for filtering/searching
export const albumQuerySchema = z.object({
  _page: z.string().regex(/^\d+$/, "Page must be a number").transform(Number).optional(),
  _limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform(Number)
    .refine((val) => !val || (val > 0 && val <= 100), "Limit must be between 1 and 100")
    .optional(),
  search: z.string().max(100, "Search term too long").optional(),
  userId: z.string().regex(/^\d+$/, "User ID must be a number").optional(),
  sort: z.enum(["title", "createdAt", "updatedAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
})

// Type exports
export type CreateAlbumInput = z.infer<typeof createAlbumSchema>
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>
export type AlbumQueryInput = z.infer<typeof albumQuerySchema>
