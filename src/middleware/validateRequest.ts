import { Request, Response, NextFunction } from "express"
import { AnyZodObject, ZodError } from "zod"

/**
 * Validation middleware factory
 * Validates request body, query, or params against a Zod schema
 */
export const validateRequest =
  (schema: AnyZodObject, source: "body" | "query" | "params" = "body") =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate the request data
      await schema.parseAsync(req[source])
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        // Format validation errors
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }))

        res.status(400).json({
          error: "Validation failed",
          details: errors,
        })
        return
      }

      // Handle unexpected errors
      res.status(500).json({ error: "Internal server error" })
      return
    }
  }

/**
 * Validate request body
 */
export const validateBody = (schema: AnyZodObject) => validateRequest(schema, "body")

/**
 * Validate query parameters
 */
export const validateQuery = (schema: AnyZodObject) => validateRequest(schema, "query")

/**
 * Validate route parameters
 */
export const validateParams = (schema: AnyZodObject) => validateRequest(schema, "params")
